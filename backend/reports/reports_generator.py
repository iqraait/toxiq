from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from django.utils import timezone
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def style_header_row(ws, columns):
    ws.append(columns)
    header_font = Font(name='Arial', size=11, bold=True, color='FFFFFF')
    header_fill = PatternFill(start_color='1A365D', end_color='1A365D', fill_type='solid')
    center_align = Alignment(horizontal='center', vertical='center', wrap_text=True)
    
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='medium', color='1E293B')
    )
    
    for col_idx in range(1, len(columns) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = thin_border
    ws.row_dimensions[1].height = 28

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = col[0].column_letter
        for cell in col:
            val_str = str(cell.value or '')
            if len(val_str) > max_len:
                max_len = len(val_str)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

def generate_registrations_excel(registrations):
    wb = Workbook()
    ws = wb.active
    ws.title = "Registrations"
    
    dynamic_keys = set()
    for reg in registrations:
        if reg.field_data:
            dynamic_keys.update(reg.field_data.keys())
    
    sorted_dynamic_keys = sorted(list(dynamic_keys))
    
    headers = [
        "Registration ID", 
        "Participant Name", 
        "Email", 
        "Phone", 
        "Created Date", 
        "Payment Status", 
        "Transaction ID", 
        "Amount"
    ]
    
    for key in sorted_dynamic_keys:
        headers.append(key.replace('_', ' ').title())
        
    style_header_row(ws, headers)
    
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    
    for row_idx, reg in enumerate(registrations, start=2):
        payment = reg.payments.filter(payment_status='SUCCESS').first()
        if not payment:
            payment = reg.payments.first()
            
        status = payment.payment_status if payment else "NO_PAYMENT"
        txnid = payment.transaction_id if payment else "N/A"
        amount = f"{payment.currency} {payment.amount:.2f}" if payment else "N/A"
        
        reg_date = reg.created_at.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M")
        
        row_data = [
            reg.registration_id or "PENDING",
            reg.participant_name,
            reg.participant_email,
            reg.participant_phone,
            reg_date,
            status,
            txnid,
            amount
        ]
        
        field_data = reg.field_data or {}
        for key in sorted_dynamic_keys:
            val = field_data.get(key, '')
            if isinstance(val, list):
                val = ", ".join(map(str, val))
            elif isinstance(val, dict):
                val = val.get('name', val.get('url', str(val)))
            row_data.append(str(val))
            
        ws.append(row_data)
        
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = Font(name='Arial', size=10)
            cell.border = thin_border
            if col_idx in [1, 5, 6]:
                cell.alignment = Alignment(horizontal='center')
            else:
                cell.alignment = Alignment(horizontal='left')
        ws.row_dimensions[row_idx].height = 20
        
    auto_fit_columns(ws)
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer.getvalue()

def generate_articles_excel(articles):
    wb = Workbook()
    ws = wb.active
    ws.title = "Articles"
    
    headers = [
        "Article ID",
        "Registration ID",
        "Author Name",
        "Email",
        "Article Title",
        "Status",
        "Submitted Date",
        "Remarks",
        "Admin Remarks"
    ]
    style_header_row(ws, headers)
    
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    
    for row_idx, art in enumerate(articles, start=2):
        sub_date = art.submitted_date.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M")
        row_data = [
            art.id,
            art.registration.registration_id or "PENDING",
            art.author_name,
            art.email,
            art.article_title,
            art.status,
            sub_date,
            art.remarks or '',
            art.admin_remarks or ''
        ]
        ws.append(row_data)
        
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = Font(name='Arial', size=10)
            cell.border = thin_border
            if col_idx in [1, 2, 6, 7]:
                cell.alignment = Alignment(horizontal='center')
            else:
                cell.alignment = Alignment(horizontal='left')
        ws.row_dimensions[row_idx].height = 20
        
    auto_fit_columns(ws)
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer.getvalue()

def generate_revenue_excel(payments):
    wb = Workbook()
    ws = wb.active
    ws.title = "Revenue Tracking"
    
    headers = [
        "Transaction ID",
        "Registration ID",
        "Participant Name",
        "Amount",
        "Currency",
        "Status",
        "Payment Mode",
        "Payment Date"
    ]
    style_header_row(ws, headers)
    
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )
    
    for row_idx, pay in enumerate(payments, start=2):
        pay_date = pay.created_at.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M")
        row_data = [
            pay.transaction_id,
            pay.registration.registration_id or "PENDING",
            pay.registration.participant_name,
            pay.amount,
            pay.currency,
            pay.payment_status,
            pay.payment_mode or 'N/A',
            pay_date
        ]
        ws.append(row_data)
        
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = Font(name='Arial', size=10)
            cell.border = thin_border
            if col_idx in [1, 2, 4, 6, 8]:
                cell.alignment = Alignment(horizontal='center')
            else:
                cell.alignment = Alignment(horizontal='left')
        ws.row_dimensions[row_idx].height = 20
        
    auto_fit_columns(ws)
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer.getvalue()


# --- PDF Generators (Landscape layout for wide reports) ---

def generate_registrations_pdf(registrations):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )
    story = []
    styles = getSampleStyleSheet()
    
    dynamic_keys = set()
    for reg in registrations:
        if reg.field_data:
            dynamic_keys.update(reg.field_data.keys())
    sorted_dynamic_keys = sorted(list(dynamic_keys))
    
    total_cols_count = 7 + len(sorted_dynamic_keys)
    fs = 8 if total_cols_count <= 9 else 6
    ld = 10 if total_cols_count <= 9 else 8
    
    # Custom styles
    title_style = ParagraphStyle(
        'RepTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=15
    )
    cell_bold = ParagraphStyle(
        'RepCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=fs,
        leading=ld,
        textColor=colors.HexColor('#ffffff')
    )
    cell_normal = ParagraphStyle(
        'RepCellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=fs,
        leading=ld,
        textColor=colors.HexColor('#334155')
    )

    story.append(Paragraph("TOXIQ Program - Registration Report", title_style))
    story.append(Paragraph(f"Generated on: {timezone.now().strftime('%d-%b-%Y %H:%M')}", cell_normal))
    story.append(Spacer(1, 10))

    headers = [
        Paragraph("Reg ID", cell_bold),
        Paragraph("Name", cell_bold),
        Paragraph("Email", cell_bold),
        Paragraph("Phone", cell_bold),
    ]
    for key in sorted_dynamic_keys:
        headers.append(Paragraph(key.replace('_', ' ').title(), cell_bold))
    headers.extend([
        Paragraph("Date", cell_bold),
        Paragraph("Payment", cell_bold),
        Paragraph("Amount", cell_bold)
    ])
    
    table_data = [headers]
    for reg in registrations:
        payment = reg.payments.filter(payment_status='SUCCESS').first() or reg.payments.first()
        status = payment.payment_status if payment else "N/A"
        amount = f"{payment.currency} {payment.amount:.2f}" if payment else "N/A"
        reg_date = reg.created_at.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d")
        
        row = [
            Paragraph(reg.registration_id or "PENDING", cell_normal),
            Paragraph(reg.participant_name, cell_normal),
            Paragraph(reg.participant_email, cell_normal),
            Paragraph(reg.participant_phone, cell_normal),
        ]
        
        field_data = reg.field_data or {}
        for key in sorted_dynamic_keys:
            val = field_data.get(key, '')
            if isinstance(val, list):
                val = ", ".join(map(str, val))
            elif isinstance(val, dict):
                val = val.get('name', val.get('url', str(val)))
            row.append(Paragraph(str(val), cell_normal))
            
        row.extend([
            Paragraph(reg_date, cell_normal),
            Paragraph(status, cell_normal),
            Paragraph(amount, cell_normal)
        ])
        table_data.append(row)
        
    if sorted_dynamic_keys:
        std_widths = [50, 75, 85, 60]  # Reg ID, Name, Email, Phone
        end_widths = [50, 45, 45]     # Date, Payment, Amount
        tot_std = sum(std_widths) + sum(end_widths)
        rem_width = 732 - tot_std
        dyn_width = max(rem_width / len(sorted_dynamic_keys), 40)
        col_widths = std_widths + [dyn_width] * len(sorted_dynamic_keys) + end_widths
    else:
        col_widths = [70, 120, 150, 90, 80, 80, 90]
        
    t = Table(table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1A365D')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

def generate_articles_pdf(articles):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'RepTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=15
    )
    cell_bold = ParagraphStyle(
        'RepCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#ffffff')
    )
    cell_normal = ParagraphStyle(
        'RepCellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#334155')
    )

    story.append(Paragraph("TOXIQ Program - Article Submissions Moderation Report", title_style))
    story.append(Paragraph(f"Generated on: {timezone.now().strftime('%d-%b-%Y %H:%M')}", cell_normal))
    story.append(Spacer(1, 10))

    headers = [
        Paragraph("ID", cell_bold),
        Paragraph("Reg ID", cell_bold),
        Paragraph("Author Name", cell_bold),
        Paragraph("Email", cell_bold),
        Paragraph("Article Title", cell_bold),
        Paragraph("Status", cell_bold),
        Paragraph("Date", cell_bold)
    ]
    
    table_data = [headers]
    for art in articles:
        sub_date = art.submitted_date.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d")
        table_data.append([
            Paragraph(str(art.id), cell_normal),
            Paragraph(art.registration.registration_id or "PENDING", cell_normal),
            Paragraph(art.author_name[:25], cell_normal),
            Paragraph(art.email[:25], cell_normal),
            Paragraph(art.article_title[:45], cell_normal),
            Paragraph(art.status, cell_normal),
            Paragraph(sub_date, cell_normal),
        ])
        
    t = Table(table_data, colWidths=[35, 75, 120, 130, 200, 75, 65])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1A365D')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

def generate_revenue_pdf(payments):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'RepTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=15
    )
    cell_bold = ParagraphStyle(
        'RepCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#ffffff')
    )
    cell_normal = ParagraphStyle(
        'RepCellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#334155')
    )

    story.append(Paragraph("TOXIQ Program - Revenue Tracking Report", title_style))
    story.append(Paragraph(f"Generated on: {timezone.now().strftime('%d-%b-%Y %H:%M')}", cell_normal))
    story.append(Spacer(1, 10))

    headers = [
        Paragraph("Transaction ID", cell_bold),
        Paragraph("Reg ID", cell_bold),
        Paragraph("Name", cell_bold),
        Paragraph("Amount", cell_bold),
        Paragraph("Status", cell_bold),
        Paragraph("Mode", cell_bold),
        Paragraph("Date", cell_bold)
    ]
    
    table_data = [headers]
    for pay in payments:
        pay_date = pay.created_at.astimezone(timezone.get_current_timezone()).strftime("%Y-%m-%d %H:%M")
        table_data.append([
            Paragraph(pay.transaction_id, cell_normal),
            Paragraph(pay.registration.registration_id or "PENDING", cell_normal),
            Paragraph(pay.registration.participant_name[:30], cell_normal),
            Paragraph(f"{pay.currency} {pay.amount:.2f}", cell_normal),
            Paragraph(pay.payment_status, cell_normal),
            Paragraph(pay.payment_mode or 'N/A', cell_normal),
            Paragraph(pay_date, cell_normal),
        ])
        
    t = Table(table_data, colWidths=[110, 80, 160, 80, 80, 85, 110])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1A365D')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
