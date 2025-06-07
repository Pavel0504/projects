import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { ServiceItem } from '../types';
import { calculateItemTotal } from '../utils/calculations';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (services: ServiceItem[]) => void;
  initialServices: ServiceItem[];
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, initialServices }) => {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const addService = () => {
    const newService: ServiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      quantity: 1,
      unit: 'шт.',
      price: 0,
      discount: 0,
      vat: 0,
      total: 0
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServices(services.map(service => {
      if (service.id === id) {
        const updated = { ...service, [field]: value };
        if (field !== 'total') {
          updated.total = calculateItemTotal(updated);
        }
        return updated;
      }
      return service;
    }));
  };

  const removeService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleSave = () => {
    onSave(services);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Детализация сделки</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="border border-slate-600 px-3 py-2 text-left text-sm font-medium">
                    Наименование
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-20">
                    Кол-во
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-20">
                    Ед.изм.
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-24">
                    Стоимость
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-20">
                    Скидка %
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-20">
                    НДС %
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-24">
                    Итого
                  </th>
                  <th className="border border-slate-600 px-3 py-2 text-center text-sm font-medium min-w-12">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
                        placeholder="Введите наименование"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={service.quantity}
                        onChange={(e) => updateService(service.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-center"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={service.unit}
                        onChange={(e) => updateService(service.id, 'unit', e.target.value)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-center"
                        placeholder="шт."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-center"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={service.discount}
                        onChange={(e) => updateService(service.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-center"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={service.vat}
                        onChange={(e) => updateService(service.id, 'vat', parseFloat(e.target.value) || 0)}
                        className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm text-center"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                      {service.total.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Добавить строку
            </button>

            <div className="flex items-center gap-4 text-sm">
              <select className="border border-gray-300 rounded px-3 py-2 bg-white">
                <option value="without-vat">Без НДС</option>
                <option value="with-vat">С НДС</option>
              </select>
            </div>
          </div>

          <div className="mt-6 bg-slate-700 text-white p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-right">
              <div></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Итого:</span>
                  <span>{services.reduce((sum, s) => sum + s.quantity * s.price, 0).toFixed(2)} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Скидка:</span>
                  <span>{services.reduce((sum, s) => sum + (s.quantity * s.price * s.discount / 100), 0).toFixed(2)} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>НДС:</span>
                  <span>0.00 руб</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-slate-500 pt-2">
                  <span>Всего к оплате:</span>
                  <span>{services.reduce((sum, s) => sum + s.total, 0).toFixed(2)} руб</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;