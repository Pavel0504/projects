import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, EyeOff, Settings } from 'lucide-react';
import { DocumentTemplate, DealData, ServiceItem, DocumentData } from '../types';
import { calculateTotals } from '../utils/calculations';
import { generateDocxDocument } from '../utils/docxGenerator';
import TemplateSelector from './TemplateSelector';
import ServiceModal from './ServiceModal';
import DocumentPreview from './DocumentPreview';

interface DocumentCreatorProps {
  deal: DealData;
  templates: DocumentTemplate[];
  onBack: () => void;
}

const DocumentCreator: React.FC<DocumentCreatorProps> = ({ deal, templates, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownloadDocument = async () => {
    if (!selectedTemplate || services.length === 0) return;
    
    try {
      const documentData: DocumentData = {
        template: selectedTemplate,
        dealData: deal,
        services,
        totals: calculateTotals(services)
      };
      
      await generateDocxDocument(documentData);
      
      // Return to deals list after successful download
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (error) {
      console.error('Ошибка при создании документа:', error);
      alert('Произошла ошибка при создании документа');
    }
  };

  const documentData: DocumentData = {
    template: selectedTemplate || templates[0],
    dealData: deal,
    services,
    totals: calculateTotals(services)
  };

  const canPreview = selectedTemplate && services.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} />
          Назад к списку сделок
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            Создание документа для сделки №{deal.number}
          </h2>
          <p className="text-gray-300 mt-1">
            {deal.clientName.lastName} {deal.clientName.firstName} {deal.clientName.middleName} • {deal.car.brand} {deal.car.model}
          </p>
        </div>
        {canPreview && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? 'Скрыть' : 'Предпросмотр'}
            </button>
            <button
              onClick={handleDownloadDocument}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Скачать DOCX
            </button>
          </div>
        )}
      </div>

      {/* Deal Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о сделке</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер сделки</label>
            <div className="text-gray-900">{deal.number}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
            <div className="text-gray-900">{deal.date}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <div className="text-gray-900">{deal.status}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Сумма</label>
            <div className="text-green-600 font-semibold">{deal.amount.toFixed(2)} ₽</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Клиент</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">ФИО:</span> {deal.clientName.lastName} {deal.clientName.firstName} {deal.clientName.middleName}</div>
              <div><span className="font-medium">Телефон:</span> {deal.phone}</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Автомобиль</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Марка и модель:</span> {deal.car.brand} {deal.car.model}</div>
              <div><span className="font-medium">Год выпуска:</span> {deal.car.year}</div>
              <div><span className="font-medium">VIN:</span> {deal.car.vin}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
      </div>

      {selectedTemplate && (
        <>
          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Товары и услуги
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings size={16} />
                Настроить услуги
              </button>
            </div>

            {services.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                          Наименование
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                          Кол-во
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                          Цена
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                          Сумма
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td className="border border-gray-300 px-3 py-2 text-sm">
                            {service.name}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                            {service.quantity} {service.unit}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                            {service.price.toFixed(2)} ₽
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                            {service.total.toFixed(2)} ₽
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Итого к оплате:</span>
                    <span>{calculateTotals(services).total.toFixed(2)} ₽</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Услуги не добавлены</p>
                <p className="text-sm">Нажмите "Настроить услуги" для добавления</p>
              </div>
            )}
          </div>

          {/* Document Preview */}
          {showPreview && canPreview && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Предварительный просмотр документа
              </h3>
              <DocumentPreview documentData={documentData} />
            </div>
          )}
        </>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={setServices}
        initialServices={services}
      />
    </div>
  );
};

export default DocumentCreator;