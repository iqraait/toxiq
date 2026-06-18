from django.urls import path
from .views import (
    DashboardStatsView,
    ExportRegistrationsView,
    ExportArticlesView,
    ExportRevenueView,
    AuditLogListView
)

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='reports_dashboard'),
    path('export-registrations/', ExportRegistrationsView.as_view(), name='reports_export_registrations'),
    path('export-articles/', ExportArticlesView.as_view(), name='reports_export_articles'),
    path('export-revenue/', ExportRevenueView.as_view(), name='reports_export_revenue'),
    path('audit-logs/', AuditLogListView.as_view(), name='reports_audit_logs'),
]
