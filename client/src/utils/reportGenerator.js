import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAuditReport = (project) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- 1. PORTADA ---
    // Fondo de encabezado
    doc.setFillColor(32, 38, 44); // Brand Dark
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Título Principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("INFORME DE AUDITORÍA CIS v8.1", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(255, 102, 0); // Brand Orange
    doc.text("HACKNOID CIS CONTROL PANEL", 14, 30);

    // Información del Proyecto
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Cliente: ${project.clientName}`, 14, 60);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Proyecto: ${project.projectName}`, 14, 70);
    doc.text(`Perfil: ${project.targetProfile}`, 14, 77);
    doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 84);

    // Score Global Grande
    doc.setDrawColor(255, 102, 0);
    doc.setLineWidth(2);
    doc.roundedRect(140, 50, 50, 40, 3, 3);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("CUMPLIMIENTO", 165, 60, { align: 'center' });

    doc.setFontSize(28);
    doc.setTextColor(32, 38, 44);
    doc.text(`${project.globalPercentage}%`, 165, 75, { align: 'center' });

    // --- 2. TABLA DE CONTROLES ---
    doc.setFontSize(14);
    doc.setTextColor(32, 38, 44);
    doc.text("Detalle de Controles", 14, 110);

    const tableData = project.controls.map(c => [
        `CIS ${c.controlNumber}`,
        c.title,
        `${c.safeguards.filter(s => s.isApplicable).length} Req.`,
        `${c.percentage}%`
    ]);

    autoTable(doc, {
        startY: 115,
        head: [['Control', 'Nombre', 'Alcance', 'Avance']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [32, 38, 44], textColor: 255 }, // Brand Dark
        styles: { fontSize: 10 },
        columnStyles: {
            0: { fontStyle: 'bold', width: 20 },
            3: { fontStyle: 'bold', halign: 'center' }
        },
        didParseCell: function (data) {
            // Colorear filas según porcentaje (Opcional)
            if (data.section === 'body' && data.column.index === 3) {
                const val = parseInt(data.cell.raw);
                if (val === 100) data.cell.styles.textColor = [0, 150, 0]; // Verde
                else if (val === 0) data.cell.styles.textColor = [200, 0, 0]; // Rojo
                else data.cell.styles.textColor = [255, 165, 0]; // Naranja
            }
        }
    });

    // --- 3. FOOTER ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generado por Hacknoid Platform - Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Descargar
    doc.save(`Reporte_CIS_${project.clientName.replace(/\s+/g, '_')}.pdf`);
};
