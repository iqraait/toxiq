from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from django.utils import timezone

def generate_receipt_pdf(registration, payment):
    """
    Generates a professional PDF receipt for TOXIQ Program registration.
    Returns: BytesIO object containing the PDF data.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    story = []

    # Setup styles
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1a365d'), # Professional Dark Blue
        alignment=1, # Center
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0d9488'), # Teal
        alignment=1, # Center
        spaceAfter=15
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1a365d'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1e293b')
    )
    
    cell_normal = ParagraphStyle(
        'CellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155')
    )

    # Document Header
    story.append(Paragraph("TOXIQ Program Management System", title_style))
    story.append(Paragraph("Official Registration & Payment Receipt", subtitle_style))
    story.append(Spacer(1, 10))

    # Payment/Registration Core Metadata (Table)
    reg_date = registration.created_at.astimezone(timezone.get_current_timezone()).strftime("%d %b %Y, %I:%M %p")
    metadata_data = [
        [
            Paragraph("Registration ID:", cell_bold),
            Paragraph(str(registration.registration_id or "PENDING"), cell_bold),
            Paragraph("Receipt Date:", cell_bold),
            Paragraph(reg_date, cell_normal)
        ],
        [
            Paragraph("Transaction ID:", cell_bold),
            Paragraph(str(payment.transaction_id), cell_normal),
            Paragraph("Payment Status:", cell_bold),
            Paragraph(str(payment.payment_status), cell_bold)
        ],
        [
            Paragraph("Payment Mode:", cell_bold),
            Paragraph(str(payment.payment_mode or "Online"), cell_normal),
            Paragraph("Amount Paid:", cell_bold),
            Paragraph(f"{payment.currency} {payment.amount:.2f}", cell_bold)
        ]
    ]
    
    metadata_table = Table(metadata_data, colWidths=[110, 150, 110, 160])
    metadata_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
    ]))
    
    story.append(metadata_table)
    story.append(Spacer(1, 15))

    # Participant Primary Details Section
    story.append(Paragraph("Participant Information", section_heading))
    
    participant_data = [
        [Paragraph("Full Name:", cell_bold), Paragraph(str(registration.participant_name), cell_normal)],
        [Paragraph("Email Address:", cell_bold), Paragraph(str(registration.participant_email), cell_normal)],
        [Paragraph("Phone Number:", cell_bold), Paragraph(str(registration.participant_phone), cell_normal)]
    ]
    
    participant_table = Table(participant_data, colWidths=[130, 400])
    participant_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
    ]))
    story.append(participant_table)
    story.append(Spacer(1, 15))

    # Dynamic Registration Fields Responses
    dynamic_responses = []
    
    # Render all fields from field_data, checking form fields for user-friendly labels if possible
    # We will fallback to printing raw keys if field configuration isn't fully matched
    field_data = registration.field_data or {}
    
    if field_data:
        story.append(Paragraph("Registration Questionnaire Details", section_heading))
        # Resolve field labels from form configuration
        field_labels = {str(f.id): f.label for f in registration.form.fields.all()}
        for key, val in field_data.items():
            # If the value is a dictionary or list, print as string
            val_str = str(val)
            if isinstance(val, list):
                val_str = ", ".join(map(str, val))
            elif isinstance(val, dict):
                # If it's file data e.g. {"url": "...", "name": "..."}
                val_str = val.get('name', val.get('url', str(val)))
            
            # Use field label if available, fallback to title-cased key
            label = field_labels.get(str(key), key.replace('_', ' ').title())
            dynamic_responses.append([
                Paragraph(label + ":", cell_bold),
                Paragraph(val_str, cell_normal)
            ])
            
        dynamic_table = Table(dynamic_responses, colWidths=[130, 400])
        dynamic_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('PADDING', (0,0), (-1,-1), 6),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ]))
        story.append(dynamic_table)
        story.append(Spacer(1, 25))

    # Official Footer / Thank you
    footer_text = ParagraphStyle(
        'FooterText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748b'),
        alignment=1, # Center
        spaceBefore=30
    )
    
    story.append(Paragraph("This is an electronically generated document. No signature is required.", footer_text))
    story.append(Paragraph("Thank you for registering for the TOXIQ Program. For support, please contact the Hospital Admin.", footer_text))

    # Build PDF
    doc.build(story)
    
    buffer.seek(0)
    return buffer
