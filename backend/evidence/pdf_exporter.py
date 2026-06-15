from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER


# Color palette
COLOR_DARK = colors.HexColor("#0f172a")
COLOR_DANGER = colors.HexColor("#dc2626")
COLOR_WARNING = colors.HexColor("#d97706")
COLOR_SUCCESS = colors.HexColor("#16a34a")
COLOR_MUTED = colors.HexColor("#64748b")
COLOR_ACCENT = colors.HexColor("#2563eb")
COLOR_LIGHT_BG = colors.HexColor("#f1f5f9")
COLOR_CRITICAL = colors.HexColor("#7f1d1d")


SEVERITY_COLORS = {
    "Critical": COLOR_DANGER,
    "High": COLOR_WARNING,
    "Medium": colors.HexColor("#ca8a04"),
    "Low": COLOR_SUCCESS,
}


def generate_pdf(evidence: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2 * cm,
        title=f"Evidence Report — {evidence.get('incident_id', 'UNKNOWN')}",
    )

    styles = getSampleStyleSheet()
    story = []

    # Custom styles
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Title"],
        fontSize=20,
        textColor=COLOR_DARK,
        spaceAfter=4,
        alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=COLOR_MUTED,
        alignment=TA_CENTER,
        spaceAfter=16,
    )
    section_header_style = ParagraphStyle(
        "SectionHeader",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=COLOR_ACCENT,
        spaceBefore=14,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=9,
        textColor=COLOR_DARK,
        leading=14,
        spaceAfter=4,
    )
    mono_style = ParagraphStyle(
        "Mono",
        parent=styles["Code"],
        fontSize=8,
        textColor=COLOR_DARK,
        backColor=COLOR_LIGHT_BG,
        leftIndent=8,
        rightIndent=8,
        spaceAfter=4,
        leading=12,
    )

    # --- HEADER ---
    story.append(Paragraph("KZ Cyber Fusion", title_style))
    story.append(Paragraph("AI-Powered Cybersecurity Intelligence Platform", subtitle_style))
    story.append(Paragraph("CYBER FRAUD EVIDENCE REPORT", ParagraphStyle(
        "ReportTitle", parent=styles["Heading1"], fontSize=15,
        textColor=COLOR_CRITICAL, alignment=TA_CENTER, spaceAfter=4,
    )))
    story.append(Paragraph(
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')} | "
        f"Incident: {evidence.get('incident_id', 'N/A')} | "
        f"Evidence ID: {evidence.get('id', 'N/A')}",
        subtitle_style,
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=COLOR_DANGER, spaceAfter=12))

    # --- SUMMARY ---
    story.append(Paragraph("1. Incident Summary", section_header_style))

    severity_text = _get_severity_from_score(evidence.get("risk_score", "0/100"))
    sev_color = SEVERITY_COLORS.get(severity_text, COLOR_MUTED)

    summary_data = [
        ["Field", "Value"],
        ["Incident ID", evidence.get("incident_id", "N/A")],
        ["Risk Score", evidence.get("risk_score", "N/A")],
        ["Confidence", evidence.get("confidence_score", "N/A")],
        ["Severity", severity_text],
        ["Generated", datetime.now().strftime("%Y-%m-%d %H:%M UTC")],
    ]
    summary_table = Table(summary_data, colWidths=[5 * cm, 12 * cm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COLOR_DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 1), (-1, -1), COLOR_LIGHT_BG),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, COLOR_LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.5, COLOR_MUTED),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("TEXTCOLOR", (1, 3), (1, 3), sev_color),
        ("FONTNAME", (1, 3), (1, 3), "Helvetica-Bold"),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        evidence.get("summary", "No summary available."),
        body_style,
    ))

    # --- AFFECTED ENTITY ---
    story.append(Paragraph("2. Affected Entity", section_header_style))
    entity = evidence.get("affected_entity", {})
    if entity:
        entity_data = [["Field", "Value"]]
        for key, val in entity.items():
            if val:
                entity_data.append([key.replace("_", " ").title(), str(val)])
        entity_table = Table(entity_data, colWidths=[5 * cm, 12 * cm])
        entity_table.setStyle(_default_table_style())
        story.append(entity_table)
    else:
        story.append(Paragraph("No entity data available.", body_style))

    # --- DETECTOR RESULTS ---
    story.append(Paragraph("3. Detection Module Results", section_header_style))
    detectors = evidence.get("detector_results", {})
    if detectors:
        det_data = [["Detector", "Score", "Severity", "Confidence", "Top Reason"]]
        for det_name, result in detectors.items():
            reasons = result.get("reasons", [])
            top_reason = reasons[0][:80] + "..." if reasons and len(reasons[0]) > 80 else (reasons[0] if reasons else "N/A")
            sev = result.get("severity", "N/A")
            det_data.append([
                det_name.capitalize(),
                f"{result.get('score', 0)}/100",
                sev,
                f"{result.get('confidence', 0):.0%}",
                top_reason,
            ])
        det_table = Table(det_data, colWidths=[2.5 * cm, 2 * cm, 2 * cm, 2.5 * cm, 8 * cm])
        det_table.setStyle(_default_table_style())
        story.append(det_table)
    else:
        story.append(Paragraph("No detector results available.", body_style))

    # --- TIMELINE ---
    story.append(Paragraph("4. Correlation Timeline", section_header_style))
    timeline = evidence.get("timeline", [])
    if timeline:
        for i, event in enumerate(timeline, 1):
            t = event.get("time", "")[:19].replace("T", " ")
            story.append(Paragraph(
                f"<b>{i}. [{t}]</b> {event.get('event', 'Unknown event')} "
                f"— Score: {event.get('score', 'N/A')} | Severity: {event.get('severity', 'N/A')}",
                body_style,
            ))
    else:
        story.append(Paragraph("No timeline data available.", body_style))

    # --- RECOMMENDED ACTIONS ---
    story.append(Paragraph("5. Recommended Response Actions", section_header_style))
    actions = evidence.get("recommended_actions", [])
    if actions:
        for i, action in enumerate(actions, 1):
            story.append(Paragraph(f"<b>{i}.</b> {action}", body_style))
    else:
        story.append(Paragraph("No response actions generated.", body_style))

    # --- EXPLAINABILITY NOTES ---
    story.append(Paragraph("6. AI Explainability Notes", section_header_style))
    notes = evidence.get("explainability_notes", [])
    if notes:
        for note in notes:
            story.append(Paragraph(f"• {note}", body_style))
    else:
        story.append(Paragraph("No explainability notes available.", body_style))

    # --- FOOTER ---
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=COLOR_MUTED))
    story.append(Paragraph(
        "KZ Cyber Fusion — AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24 | "
        "CONFIDENTIAL — FOR ANALYST USE ONLY",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=7, textColor=COLOR_MUTED, alignment=TA_CENTER),
    ))

    doc.build(story)
    return buffer.getvalue()


def _default_table_style() -> TableStyle:
    return TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COLOR_DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, COLOR_LIGHT_BG]),
        ("GRID", (0, 0), (-1, -1), 0.5, COLOR_MUTED),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ])


def _get_severity_from_score(risk_score_str: str) -> str:
    try:
        score = int(str(risk_score_str).split("/")[0])
        if score >= 80:
            return "Critical"
        elif score >= 60:
            return "High"
        elif score >= 40:
            return "Medium"
        return "Low"
    except (ValueError, IndexError):
        return "Unknown"
