from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
import logging

from registration.models import Registration, Payment
from articles.models import ArticleSubmission
from .models import AuditLog
from authentication.permissions import IsAdminUserRole
from .reports_generator import (
    generate_registrations_excel, generate_registrations_pdf,
    generate_articles_excel, generate_articles_pdf,
    generate_revenue_excel, generate_revenue_pdf
)

logger = logging.getLogger(__name__)

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        # 1. Total registrations & breakdowns
        total_regs = Registration.objects.count()
        success_regs = Registration.objects.filter(payments__payment_status='SUCCESS').distinct().count()
        pending_regs = Registration.objects.filter(payments__payment_status='PENDING').distinct().count()

        # 2. Payments & Revenue
        total_revenue = Payment.objects.filter(payment_status='SUCCESS').aggregate(sum=Sum('amount'))['sum'] or 0.00
        success_payments = Payment.objects.filter(payment_status='SUCCESS').count()
        pending_payments = Payment.objects.filter(payment_status='PENDING').count()
        failed_payments = Payment.objects.filter(payment_status='FAILED').count()

        # 3. Article submission counts
        total_articles = ArticleSubmission.objects.count()
        pending_articles = ArticleSubmission.objects.filter(status='SUBMITTED').count()
        review_articles = ArticleSubmission.objects.filter(status='UNDER_REVIEW').count()
        approved_articles = ArticleSubmission.objects.filter(status='APPROVED').count()
        rejected_articles = ArticleSubmission.objects.filter(status='REJECTED').count()

        # 4. Chart Data: Monthly Registrations (Last 6 Months)
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_regs = Registration.objects.filter(created_at__gte=six_months_ago) \
            .annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

        regs_chart = []
        for mr in monthly_regs:
            month_label = mr['month'].strftime("%b %Y") if mr['month'] else ""
            regs_chart.append({'month': month_label, 'count': mr['count']})

        # Chart Data: Monthly Revenue (Last 6 Months)
        monthly_rev = Payment.objects.filter(payment_status='SUCCESS', created_at__gte=six_months_ago) \
            .annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(amount=Sum('amount')) \
            .order_by('month')

        rev_chart = []
        for mr in monthly_rev:
            month_label = mr['month'].strftime("%b %Y") if mr['month'] else ""
            rev_chart.append({'month': month_label, 'revenue': float(mr['amount'] or 0)})

        # 5. Recent 5 items for dashboard listing
        recent_regs = Registration.objects.all().order_by('-created_at')[:5]
        recent_regs_data = []
        for r in recent_regs:
            pay = r.payments.first()
            recent_regs_data.append({
                'id': r.id,
                'registration_id': r.registration_id or 'PENDING',
                'name': r.participant_name,
                'email': r.participant_email,
                'created_at': r.created_at,
                'payment_status': pay.payment_status if pay else 'N/A'
            })

        recent_payments = Payment.objects.all().order_by('-created_at')[:5]
        recent_payments_data = []
        for p in recent_payments:
            recent_payments_data.append({
                'transaction_id': p.transaction_id,
                'name': p.registration.participant_name,
                'amount': float(p.amount),
                'status': p.payment_status,
                'created_at': p.created_at
            })

        return Response({
            'kpi': {
                'total_registrations': total_regs,
                'successful_registrations': success_regs,
                'pending_registrations': pending_regs,
                'total_revenue': float(total_revenue),
                'payments': {
                    'success': success_payments,
                    'pending': pending_payments,
                    'failed': failed_payments
                },
                'articles': {
                    'total': total_articles,
                    'submitted': pending_articles,
                    'under_review': review_articles,
                    'approved': approved_articles,
                    'rejected': rejected_articles
                }
            },
            'charts': {
                'registrations': regs_chart,
                'revenue': rev_chart
            },
            'recent': {
                'registrations': recent_regs_data,
                'payments': recent_payments_data
            }
        })

class ExportRegistrationsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        export_format = request.query_params.get('file_format', 'excel').lower()
        registrations = Registration.objects.all().order_by('-created_at')
        
        status_filter = request.query_params.get('payment_status')
        search_query = request.query_params.get('search')
        
        if status_filter:
            registrations = registrations.filter(payments__payment_status=status_filter).distinct()
        if search_query:
            registrations = registrations.filter(
                participant_name__icontains=search_query
            ) | registrations.filter(
                participant_email__icontains=search_query
            ) | registrations.filter(
                registration_id__icontains=search_query
            ) | registrations.filter(
                participant_phone__icontains=search_query
            )
        
        # Log Admin Action
        AuditLog.log(
            user=request.user, 
            action="EXPORT_REGISTRATIONS", 
            details=f"Exported registrations list in format: {export_format.upper()}",
            request=request
        )

        if export_format == 'pdf':
            pdf_bytes = generate_registrations_pdf(registrations)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="TOXIQ_Registrations_Report.pdf"'
            return response
        else:
            excel_bytes = generate_registrations_excel(registrations)
            response = HttpResponse(
                excel_bytes,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="TOXIQ_Registrations_Report.xlsx"'
            return response

class ExportArticlesView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        export_format = request.query_params.get('file_format', 'excel').lower()
        articles = ArticleSubmission.objects.all().order_by('-submitted_date')
        
        # Log Admin Action
        AuditLog.log(
            user=request.user, 
            action="EXPORT_ARTICLES", 
            details=f"Exported article submissions in format: {export_format.upper()}",
            request=request
        )

        if export_format == 'pdf':
            pdf_bytes = generate_articles_pdf(articles)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="TOXIQ_Articles_Report.pdf"'
            return response
        else:
            excel_bytes = generate_articles_excel(articles)
            response = HttpResponse(
                excel_bytes,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="TOXIQ_Articles_Report.xlsx"'
            return response

class ExportRevenueView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        export_format = request.query_params.get('file_format', 'excel').lower()
        period = request.query_params.get('period', 'all').lower() # all, daily, monthly, yearly
        
        payments = Payment.objects.filter(payment_status='SUCCESS').order_by('-created_at')
        
        # Apply filters based on period
        now = timezone.now()
        if period == 'daily':
            payments = payments.filter(created_at__date=now.date())
        elif period == 'monthly':
            payments = payments.filter(created_at__year=now.year, created_at__month=now.month)
        elif period == 'yearly':
            payments = payments.filter(created_at__year=now.year)
            
        # Log Admin Action
        AuditLog.log(
            user=request.user, 
            action="EXPORT_REVENUE", 
            details=f"Exported revenue ({period.upper()}) in format: {export_format.upper()}",
            request=request
        )

        if export_format == 'pdf':
            pdf_bytes = generate_revenue_pdf(payments)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="TOXIQ_Revenue_{period}_Report.pdf"'
            return response
        else:
            excel_bytes = generate_revenue_excel(payments)
            response = HttpResponse(
                excel_bytes,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="TOXIQ_Revenue_{period}_Report.xlsx"'
            return response

class AuditLogListView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        logs = AuditLog.objects.all().order_by('-timestamp')
        
        # Basic pagination manually or serialization
        logs_data = []
        for l in logs[:100]: # Return last 100 entries
            logs_data.append({
                'id': l.id,
                'user': l.user.username if l.user else 'System',
                'action': l.action,
                'ip_address': l.ip_address,
                'timestamp': l.timestamp,
                'details': l.details
            })
        return Response(logs_data)
