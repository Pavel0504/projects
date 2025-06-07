import React from 'react';
import { DocumentData } from '../types';
import { calculateTotals, numberToWords } from '../utils/calculations';

interface DocumentPreviewProps {
  documentData: DocumentData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ documentData }) => {
  const { dealData, services } = documentData;
  const totals = calculateTotals(services);

  return (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto" id="document-preview">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">ЗАКАЗ-НАРЯД</h1>
          <p className="text-lg">№{dealData.number} от {dealData.date}</p>
        </div>

        {/* Executor Info */}
        <div className="space-y-2">
          <p><strong>Исполнитель:</strong> ИП ИВАНОВ ИВАН ИВАНОВИЧ, ИНН 366555444001, РОССИЯ, КУТЯКОВА, УЛ. 15.</p>
        </div>

        {/* Client Info */}
        <div className="space-y-2">
          <p><strong>Заказчик:</strong> {dealData.clientName.lastName} {dealData.clientName.firstName} {dealData.clientName.middleName}</p>
          <p><strong>Телефон:</strong> {dealData.phone}</p>
        </div>

        {/* Car Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Марка:</strong> {dealData.car.brand}</p>
            <p><strong>Модель:</strong> {dealData.car.model}</p>
          </div>
          <div>
            <p><strong>VIN:</strong> {dealData.car.vin}</p>
            <p><strong>Год выпуска:</strong> {dealData.car.year}</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-2 py-1 text-left text-sm">№</th>
                <th className="border border-black px-2 py-1 text-left text-sm">Наименование работ/услуг</th>
                <th className="border border-black px-2 py-1 text-center text-sm">Кол-во</th>
                <th className="border border-black px-2 py-1 text-center text-sm">Ед.изм.</th>
                <th className="border border-black px-2 py-1 text-center text-sm">Цена, руб.</th>
                <th className="border border-black px-2 py-1 text-center text-sm">Сумма, руб.</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={service.id}>
                  <td className="border border-black px-2 py-1 text-sm">{index + 1}</td>
                  <td className="border border-black px-2 py-1 text-sm">{service.name}</td>
                  <td className="border border-black px-2 py-1 text-center text-sm">{service.quantity}</td>
                  <td className="border border-black px-2 py-1 text-center text-sm">{service.unit}</td>
                  <td className="border border-black px-2 py-1 text-center text-sm">{service.price.toFixed(2)}</td>
                  <td className="border border-black px-2 py-1 text-center text-sm">{service.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Итого:</p>
              <p>Скидка:</p>
              <p><strong>Всего к оплате:</strong></p>
            </div>
            <div className="text-right">
              <p>{totals.subtotal.toFixed(2)} руб.</p>
              <p>{totals.discount.toFixed(2)} руб.</p>
              <p><strong>{totals.total.toFixed(2)} руб.</strong></p>
            </div>
          </div>
          <p className="text-sm">НДС не облагается.</p>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <p><strong>Всего наименований {services.length}, на сумму: {numberToWords(totals.total)}</strong></p>
        </div>

        {/* Agreement */}
        <div className="space-y-2">
          <p><strong>Согласие клиента:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>С перечнем и стоимостью работ ознакомлен и согласен.</li>
            <li>Даю согласие на обработку моих персональных данных (ФИО, номер телефона, марка и модель автомобиля) для целей исполнения настоящего заказ-наряда, информирования о статусе выполнения работ, а также для направления рекламных и информационных материалов о деятельности компании. Согласие может быть отозвано в любой момент путем направления письменного заявления в адрес компании.</li>
          </ul>
        </div>

        {/* Signatures */}
        <div className="space-y-4 mt-8">
          <p><strong>Подписи:</strong></p>
          <div className="space-y-3">
            <p>Заказчик: _____________________________________________________________</p>
            <p>Представитель компании: ______________________________________</p>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4 mt-8">
          <p><strong>Примечания к заказ-наряду:</strong></p>
          <div className="border border-black h-20 w-full"></div>
        </div>

        {/* Final */}
        <div className="space-y-3 mt-8">
          <p>Претензий по качеству выполненных работ не имею.</p>
          <p>Клиент: _______________________________</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;