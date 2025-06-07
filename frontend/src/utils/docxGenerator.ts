import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { DocumentData } from '../types';
import { numberToWords } from './calculations';

export const generateDocxDocument = async (documentData: DocumentData) => {
  const { dealData, services, totals } = documentData;

  // Create document sections
  const children: (Paragraph | Table)[] = [];

  // Header
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "ЗАКАЗ-НАРЯД",
          bold: true,
          size: 32,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `№${dealData.number} от ${dealData.date}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Executor info
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Исполнитель: ",
          bold: true,
        }),
        new TextRun({
          text: "ИП ИВАНОВ ИВАН ИВАНОВИЧ, ИНН 366555444001, РОССИЯ, КУТЯКОВА, УЛ. 15.",
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Client info
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Заказчик: ",
          bold: true,
        }),
        new TextRun({
          text: `${dealData.clientName.lastName} ${dealData.clientName.firstName} ${dealData.clientName.middleName}`,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Телефон: ",
          bold: true,
        }),
        new TextRun({
          text: dealData.phone,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Car info in a more compact format
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Марка: ",
          bold: true,
        }),
        new TextRun({
          text: `${dealData.car.brand}    `,
        }),
        new TextRun({
          text: "Модель: ",
          bold: true,
        }),
        new TextRun({
          text: dealData.car.model,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "VIN: ",
          bold: true,
        }),
        new TextRun({
          text: `${dealData.car.vin}    `,
        }),
        new TextRun({
          text: "Год выпуска: ",
          bold: true,
        }),
        new TextRun({
          text: dealData.car.year,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Services table with proper formatting
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "№", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 800, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "Наименование работ/услуг", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 4000, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "Кол-во", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 1000, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "Ед.изм.", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 1000, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "Цена, руб.", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 1500, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: "Сумма, руб.", bold: true })],
            alignment: AlignmentType.CENTER
          })],
          width: { size: 1500, type: WidthType.DXA },
        }),
      ],
    }),
  ];

  services.forEach((service, index) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: (index + 1).toString() })],
              alignment: AlignmentType.CENTER
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: service.name })],
              alignment: AlignmentType.LEFT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: service.quantity.toString() })],
              alignment: AlignmentType.CENTER
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: service.unit })],
              alignment: AlignmentType.CENTER
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: service.price.toFixed(2) })],
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: service.total.toFixed(2) })],
              alignment: AlignmentType.RIGHT
            })],
          }),
        ],
      })
    );
  });

  const servicesTable = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
  });

  children.push(servicesTable);

  // Empty line after table
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { before: 400, after: 200 },
    })
  );

  // Totals section
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Итого: " }),
        new TextRun({ text: `${totals.subtotal.toFixed(2)} руб.` }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Скидка: " }),
        new TextRun({ text: `${totals.discount.toFixed(2)} руб.` }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Всего к оплате: ", bold: true }),
        new TextRun({ text: `${totals.total.toFixed(2)} руб.`, bold: true }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "НДС не облагается." })],
      spacing: { after: 200 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Summary
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Всего наименований ${services.length}, на сумму: ${numberToWords(totals.total)}`,
          bold: true,
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Agreement section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Согласие клиента:",
          bold: true,
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "• С перечнем и стоимостью работ ознакомлен и согласен.",
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "• Даю согласие на обработку моих персональных данных (ФИО, номер телефона, марка и модель автомобиля) для целей исполнения настоящего заказ-наряда, информирования о статусе выполнения работ, а также для направления рекламных и информационных материалов о деятельности компании. Согласие может быть отозвано в любой момент путем направления письменного заявления в адрес компании.",
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Signatures section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Подписи:",
          bold: true,
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Заказчик: _____________________________________________________________",
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Представитель компании: ______________________________________",
        }),
      ],
      spacing: { after: 400 },
    })
  );

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Notes section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Примечания к заказ-наряду:",
          bold: true,
        }),
      ],
      spacing: { after: 600 },
    })
  );

  // Add some empty lines for notes
  for (let i = 0; i < 3; i++) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "" })],
        spacing: { after: 200 },
      })
    );
  }

  // Empty line
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      spacing: { after: 200 },
    })
  );

  // Final section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Претензий по качеству выполненных работ не имею.",
        }),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Клиент: _______________________________",
        }),
      ],
    })
  );

  // Create document with proper margins and formatting
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Заказ-наряд_${dealData.number}_${dealData.date}.docx`);
};