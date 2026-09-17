from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import urllib.request

def generate_pdf():
    buffer = BytesIO()
    # Margins and layout
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor("#0f172a"),
        alignment=1, # Center
        spaceAfter=5
    )
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontName='Helvetica',
        fontSize=14,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=20
    )
    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.white,
        backColor=colors.HexColor("#1e293b"),
        alignment=0,
        spaceBefore=15,
        spaceAfter=10,
        leftIndent=5,
        rightIndent=5,
        borderPadding=5
    )
    normal_style = styles['Normal']
    normal_style.fontName = 'Helvetica'
    normal_style.fontSize = 10
    
    elements = []
    
    # Try fetching the logo
    logo_url = "https://lh3.googleusercontent.com/aida-public/AB6AXuBD79bpMlsPyt30Xx086RJmYzJdAMRfM84Mde2muNorBXaqMtV4lAQaNPEZCMeX5LigT_5RbOsVNBKrhrZVPpc7KDhanIyIrBAqcR0FUeIjVESZacQjnGJvwBJeWCNVT05kH8nrVGuGsMPeYfmqJBKH1w-DaVz0j1AhVK9WxEyyHaQq-57IP6gWuHrZhOJj2YepwQOtNyJ1_u99tAIgsAqEcuXwQLHqWKRWM-gz1Ezgra6mwHtOr1d1XjxRV5PJl-0blnI5RKWKI31E"
    
    try:
        req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            img_data = response.read()
        img_buffer = BytesIO(img_data)
        img = Image(img_buffer, width=60, height=60)
        img.hAlign = 'CENTER'
        elements.append(img)
    except Exception as e:
        print("Could not load image:", e)
    
    # Title
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(f"REPORTE OFICIAL DE INVESTIGACIÓN", title_style))
    elements.append(Paragraph(f"SafeCity Intelligence Department", subtitle_style))
    elements.append(Spacer(1, 20))
    
    # Basic Info
    elements.append(Paragraph("1. INFORMACIÓN DEL INCIDENTE", h2_style))
    data = [
        ['Número de Caso:', 'D656287', 'Fecha del Hecho:', '2025-11-20'],
        ['Tipo Primario:', 'ROBBERY', 'Gravedad:', 'HIGH'],
        ['Estado:', 'Active', 'Arresto:', 'No'],
        ['Ubicación:', 'APARTMENT', 'Distrito:', '011'],
        ['Descripción:', 'ARMED ROBBERY', '', '']
    ]
    t = Table(data, colWidths=[110, 150, 110, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor("#334155")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))
    
    # Timeline Logs
    elements.append(Paragraph("2. LÍNEA DE TIEMPO / LOGS DE SEGUIMIENTO", h2_style))
    log_data = [['Fecha', 'Oficial', 'Acción', 'Comentario']]
    timeline = [
        {'fecha': '2025-11-20 10:00', 'oficial': 'Det. Smith', 'accion': 'Nota', 'comentario': 'Se inició la investigación.'},
        {'fecha': '2025-11-21 12:00', 'oficial': 'Det. Smith', 'accion': 'Testigo', 'comentario': 'Testigo aportó información valiosa.'}
    ]
    for log in timeline:
        fecha = str(log.get('fecha', ''))[:16].replace('T', ' ')
        oficial = log.get('oficial', 'N/A')
        accion = log.get('accion', 'N/A')
        comentario = Paragraph(str(log.get('comentario', 'N/A')), normal_style)
        log_data.append([fecha, oficial, accion, comentario])
        
    t_logs = Table(log_data, colWidths=[80, 90, 90, 260])
    t_logs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f1f5f9")])
    ]))
    elements.append(t_logs)
    
    doc.build(elements)
    
    with open('test_pdf.pdf', 'wb') as f:
        f.write(buffer.getvalue())

if __name__ == '__main__':
    generate_pdf()
    print("Done")
