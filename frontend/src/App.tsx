import React, { useState, useEffect } from 'react';
import { FileText, Edit, Settings } from 'lucide-react';
import { DocumentTemplate, DealData } from './types';
import { amoCrmApi, AmoCrmConfig } from './services/amoCrmApi';
import { mapAmoCrmDealToLocal } from './utils/dealMapper';
import DealsList from './components/DealsList';
import DocumentCreator from './components/DocumentCreator';
import TemplateEditor from './components/TemplateEditor';
import AmoCrmConfigModal from './components/AmoCrmConfig';

const initialTemplates: DocumentTemplate[] = [
  {
    id: 'standard',
    name: 'Стандартный заказ-наряд',
    description: 'Базовый шаблон для автосервиса с полным набором полей',
    content: `ЗАКАЗ-НАРЯД
№{{ДОКУМЕНТ||Номер}} от {{ДОКУМЕНТ||Дата}}

Исполнитель: ИП ИВАНОВ ИВАН ИВАНОВИЧ, ИНН 366555444001, РОССИЯ, КУТЯКОВА, УЛ. 15.

Заказчик: {{СДЕЛКА||Фамилия}} {{СДЕЛКА||Имя}} {{СДЕЛКА||Отчество}}
Телефон: {{КОНТАКТ||Телефон}}

Марка: {{СДЕЛКА||Марка}}
Модель: {{СДЕЛКА||Модель}}
VIN: {{СДЕЛКА||VIN}}
Год выпуска: {{СДЕЛКА||Год выпуска}}

{{ФАКТУРНАЯ ЧАСТЬ||Товары}}

Итого: {{ФАКТУРНАЯ ЧАСТЬ||Итого}}
Скидка: {{ФАКТУРНАЯ ЧАСТЬ||Скидка}}
Всего к оплате: {{ФАКТУРНАЯ ЧАСТЬ||Всего к оплате}}
НДС не облагается.

Всего наименований {{ФАКТУРНАЯ ЧАСТЬ||Количество}}, на сумму: {{ФАКТУРНАЯ ЧАСТЬ||Сумма прописью}}

Согласие клиента:
• С перечнем и стоимостью работ ознакомлен и согласен.
• Даю согласие на обработку моих персональных данных (ФИО, номер телефона, марка и модель автомобиля) для целей исполнения настоящего заказ-наряда, информирования о статусе выполнения работ, а также для направления рекламных и информационных материалов о деятельности компании. Согласие может быть отозвано в любой момент путем направления письменного заявления в адрес компании.

Подписи:
Заказчик: _____________________________________________________________
Представитель компании: ______________________________________

Примечания к заказ-наряду:


Претензий по качеству выполненных работ не имею.
Клиент: _______________________________`
  },
  {
    id: 'extended',
    name: 'Расширенный заказ-наряд',
    description: 'Детализированный шаблон с дополнительными полями и примечаниями',
    content: `ЗАКАЗ-НАРЯД (РАСШИРЕННЫЙ)
№{{ДОКУМЕНТ||Номер}} от {{ДОКУМЕНТ||Дата}}

Исполнитель: ИП ИВАНОВ ИВАН ИВАНОВИЧ, ИНН 366555444001, РОССИЯ, КУТЯКОВА, УЛ. 15.

Заказчик: {{СДЕЛКА||Фамилия}} {{СДЕЛКА||Имя}} {{СДЕЛКА||Отчество}}
Телефон: {{КОНТАКТ||Телефон}}

Данные автомобиля:
Марка: {{СДЕЛКА||Марка}}
Модель: {{СДЕЛКА||Модель}}
VIN: {{СДЕЛКА||VIN}}
Год выпуска: {{СДЕЛКА||Год выпуска}}

{{ФАКТУРНАЯ ЧАСТЬ||Товары}}

Финансовая информация:
Итого: {{ФАКТУРНАЯ ЧАСТЬ||Итого}}
Скидка: {{ФАКТУРНАЯ ЧАСТЬ||Скидка}}
Всего к оплате: {{ФАКТУРНАЯ ЧАСТЬ||Всего к оплате}}
НДС не облагается.

Всего наименований {{ФАКТУРНАЯ ЧАСТЬ||Количество}}, на сумму: {{ФАКТУРНАЯ ЧАСТЬ||Сумма прописью}}

Согласие клиента:
• С перечнем и стоимостью работ ознакомлен и согласен.
• Даю согласие на обработку моих персональных данных (ФИО, номер телефона, марка и модель автомобиля) для целей исполнения настоящего заказ-наряда, информирования о статусе выполнения работ, а также для направления рекламных и информационных материалов о деятельности компании. Согласие может быть отозвано в любой момент путем направления письменного заявления в адрес компании.

Подписи:
Заказчик: _____________________________________________________________
Представитель компании: ______________________________________

Дополнительные примечания:


Претензий по качеству выполненных работ не имею.
Клиент: _______________________________`
  }
];

function App() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(initialTemplates);
  const [deals, setDeals] = useState<DealData[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<DealData | null>(null);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [isAmoCrmConfigOpen, setIsAmoCrmConfigOpen] = useState(false);
  const [amoCrmConfig, setAmoCrmConfig] = useState<AmoCrmConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load AMO CRM config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('amoCrmConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setAmoCrmConfig(config);
        amoCrmApi.setConfig(config);
      } catch (error) {
        console.error('Error loading AMO CRM config:', error);
      }
    }
  }, []);

  // Load deals when config is available
  useEffect(() => {
    if (amoCrmConfig && amoCrmApi.isConfigured()) {
      loadDeals();
    }
  }, [amoCrmConfig]);

  const loadDeals = async () => {
    if (!amoCrmApi.isConfigured()) {
      setError('AMO CRM не настроен. Пожалуйста, настройте подключение.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch deals with contacts
      const dealsResponse = await amoCrmApi.getDeals({
        limit: 50,
        with: 'contacts'
      });

      const amoCrmDeals = dealsResponse._embedded.leads || [];
      
      if (amoCrmDeals.length === 0) {
        setDeals([]);
        return;
      }

      // Get all unique contact IDs
      const contactIds = new Set<number>();
      amoCrmDeals.forEach(deal => {
        if (deal._embedded?.contacts) {
          deal._embedded.contacts.forEach(contact => {
            contactIds.add(contact.id);
          });
        }
      });

      // Fetch contacts data
      let contactsMap = new Map();
      if (contactIds.size > 0) {
        try {
          const contactsResponse = await amoCrmApi.getContacts(Array.from(contactIds));
          const contacts = contactsResponse._embedded.contacts || [];
          contacts.forEach(contact => {
            contactsMap.set(contact.id, contact);
          });
        } catch (contactError) {
          console.warn('Error fetching contacts:', contactError);
        }
      }

      // Map deals to local format
      const mappedDeals = amoCrmDeals.map(deal => {
        const mainContact = deal._embedded?.contacts?.find(c => c.is_main);
        const contact = mainContact ? contactsMap.get(mainContact.id) : null;
        return mapAmoCrmDealToLocal(deal, contact);
      });

      setDeals(mappedDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке сделок');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = (deal: DealData) => {
    setSelectedDeal(deal);
  };

  const handleBackToDeals = () => {
    setSelectedDeal(null);
  };

  const handleUpdateTemplates = (updatedTemplates: DocumentTemplate[]) => {
    setTemplates(updatedTemplates);
  };

  const handleSaveAmoCrmConfig = (config: AmoCrmConfig) => {
    setAmoCrmConfig(config);
    amoCrmApi.setConfig(config);
    localStorage.setItem('amoCrmConfig', JSON.stringify(config));
    setError(null);
    // Reload deals with new config
    loadDeals();
  };

  const isAmoCrmConfigured = amoCrmConfig && amoCrmApi.isConfigured();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d2a44' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">
                Генератор документов AMO CRM
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAmoCrmConfigOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isAmoCrmConfigured 
                    ? 'text-green-600 border-green-300 bg-green-50 hover:bg-green-100' 
                    : 'text-orange-600 border-orange-300 bg-orange-50 hover:bg-orange-100'
                }`}
              >
                <Settings size={16} />
                {isAmoCrmConfigured ? 'AMO CRM настроен' : 'Настроить AMO CRM'}
              </button>
              <button
                onClick={() => setIsTemplateEditorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit size={16} />
                Редактировать шаблоны
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedDeal ? (
          <DocumentCreator
            deal={selectedDeal}
            templates={templates}
            onBack={handleBackToDeals}
          />
        ) : (
          <DealsList
            deals={deals}
            onCreateDocument={handleCreateDocument}
            loading={loading}
            error={error}
            isAmoCrmConfigured={isAmoCrmConfigured}
            onRefresh={loadDeals}
            onConfigureAmoCrm={() => setIsAmoCrmConfigOpen(true)}
          />
        )}
      </div>

      {/* Template Editor Modal */}
      <TemplateEditor
        isOpen={isTemplateEditorOpen}
        onClose={() => setIsTemplateEditorOpen(false)}
        templates={templates}
        onSave={handleUpdateTemplates}
      />

      {/* AMO CRM Config Modal */}
      <AmoCrmConfigModal
        isOpen={isAmoCrmConfigOpen}
        onClose={() => setIsAmoCrmConfigOpen(false)}
        onSave={handleSaveAmoCrmConfig}
        currentConfig={amoCrmConfig || undefined}
      />
    </div>
  );
}

export default App;