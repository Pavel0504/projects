import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { AmoCrmConfig } from '../services/amoCrmApi';

interface AmoCrmConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AmoCrmConfig) => void;
  currentConfig?: AmoCrmConfig;
}

const AmoCrmConfigModal: React.FC<AmoCrmConfigProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentConfig 
}) => {
  const [subdomain, setSubdomain] = useState(currentConfig?.subdomain || '');
  const [accessToken, setAccessToken] = useState(currentConfig?.accessToken || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!subdomain.trim()) {
      setError('Поддомен обязателен для заполнения');
      return;
    }
    
    if (!accessToken.trim()) {
      setError('Токен доступа обязателен для заполнения');
      return;
    }

    onSave({
      subdomain: subdomain.trim(),
      accessToken: accessToken.trim()
    });
    
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Настройка AMO CRM</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поддомен AMO CRM
            </label>
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example (без .amocrm.ru)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Введите только поддомен, например: mycompany
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Токен доступа
            </label>
            <textarea
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Вставьте токен доступа AMO CRM"
            />
            <p className="text-xs text-gray-500 mt-1">
              Получите токен в настройках интеграции AMO CRM
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Как получить токен:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Войдите в AMO CRM</li>
              <li>Перейдите в Настройки → Интеграции</li>
              <li>Создайте новую интеграцию или используйте существующую</li>
              <li>Скопируйте токен доступа</li>
            </ol>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmoCrmConfigModal;