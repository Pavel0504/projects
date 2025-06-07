import React from 'react';
import { DealData } from '../types';
import { FileText, Car, Phone, Calendar, RefreshCw, Settings, AlertCircle } from 'lucide-react';

interface DealsListProps {
  deals: DealData[];
  onCreateDocument: (deal: DealData) => void;
  loading?: boolean;
  error?: string | null;
  isAmoCrmConfigured?: boolean;
  onRefresh?: () => void;
  onConfigureAmoCrm?: () => void;
}

const DealsList: React.FC<DealsListProps> = ({ 
  deals, 
  onCreateDocument, 
  loading = false,
  error = null,
  isAmoCrmConfigured = false,
  onRefresh,
  onConfigureAmoCrm
}) => {
  if (!isAmoCrmConfigured) {
    return (
      <div className="text-center py-12">
        <Settings size={64} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-white mb-2">AMO CRM не настроен</h3>
        <p className="text-gray-300 mb-6">
          Для загрузки сделок необходимо настроить подключение к AMO CRM
        </p>
        <button
          onClick={onConfigureAmoCrm}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Настроить AMO CRM
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium text-white mb-2">Ошибка загрузки сделок</h3>
        <p className="text-gray-300 mb-6">{error}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw size={16} />
            Попробовать снова
          </button>
          <button
            onClick={onConfigureAmoCrm}
            className="px-6 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors font-medium"
          >
            Настроить AMO CRM
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-white mb-2">Загрузка сделок</h3>
        <p className="text-gray-300">Получаем данные из AMO CRM...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Список сделок</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">
            Всего сделок: {deals.length}
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={16} />
            Обновить
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Сделка №{deal.number}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    deal.status.includes('Новая') || deal.status.includes('Первичный') ? 'bg-blue-100 text-blue-800' :
                    deal.status.includes('работе') || deal.status.includes('Переговоры') ? 'bg-yellow-100 text-yellow-800' :
                    deal.status.includes('Завершена') || deal.status.includes('Успешно') ? 'bg-green-100 text-green-800' :
                    deal.status.includes('Закрыто') ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {deal.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{deal.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{deal.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car size={16} />
                    <span>{deal.car.brand} {deal.car.model}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Сумма: </span>
                    <span className="text-green-600 font-semibold">{deal.amount.toFixed(2)} ₽</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Клиент: </span>
                    <span className="text-gray-900">
                      {deal.clientName.lastName} {deal.clientName.firstName} {deal.clientName.middleName}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Автомобиль: </span>
                    <span className="text-gray-900">
                      {deal.car.brand} {deal.car.model} ({deal.car.year}), VIN: {deal.car.vin}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <button
                  onClick={() => onCreateDocument(deal)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <FileText size={18} />
                  Создать документ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-2">Нет доступных сделок</h3>
          <p className="text-gray-300 mb-6">
            В вашем AMO CRM нет сделок или они не соответствуют критериям фильтрации
          </p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mx-auto"
          >
            <RefreshCw size={16} />
            Обновить список
          </button>
        </div>
      )}
    </div>
  );
};

export default DealsList;