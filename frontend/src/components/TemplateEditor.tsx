import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { DocumentTemplate } from '../types';

interface TemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  templates: DocumentTemplate[];
  onSave: (templates: DocumentTemplate[]) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ isOpen, onClose, templates, onSave }) => {
  const [editingTemplates, setEditingTemplates] = useState<DocumentTemplate[]>(templates);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditingTemplates(templates);
    setSelectedTemplate(null);
    setIsEditing(false);
  }, [templates, isOpen]);

  const addNewTemplate = () => {
    const newTemplate: DocumentTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Новый шаблон',
      description: 'Описание нового шаблона',
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
    };
    
    setEditingTemplates([...editingTemplates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const deleteTemplate = (templateId: string) => {
    if (editingTemplates.length <= 1) {
      alert('Нельзя удалить последний шаблон');
      return;
    }
    
    const updatedTemplates = editingTemplates.filter(t => t.id !== templateId);
    setEditingTemplates(updatedTemplates);
    
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      setIsEditing(false);
    }
  };

  const updateTemplate = (field: keyof DocumentTemplate, value: string) => {
    if (!selectedTemplate) return;
    
    const updatedTemplate = { ...selectedTemplate, [field]: value };
    setSelectedTemplate(updatedTemplate);
    
    const updatedTemplates = editingTemplates.map(t => 
      t.id === selectedTemplate.id ? updatedTemplate : t
    );
    setEditingTemplates(updatedTemplates);
  };

  const handleSave = () => {
    onSave(editingTemplates);
    onClose();
  };

  const handleCancel = () => {
    setEditingTemplates(templates);
    setSelectedTemplate(null);
    setIsEditing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Редактор шаблонов</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Templates List */}
          <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Шаблоны</h3>
              <button
                onClick={addNewTemplate}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} />
                Добавить
              </button>
            </div>
            
            <div className="space-y-2">
              {editingTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Editor */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    {isEditing ? 'Редактирование шаблона' : 'Просмотр шаблона'}
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={14} />
                      Редактировать
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Название шаблона
                      </label>
                      <input
                        type="text"
                        value={selectedTemplate.name}
                        onChange={(e) => updateTemplate('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <input
                        type="text"
                        value={selectedTemplate.description}
                        onChange={(e) => updateTemplate('description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Содержимое шаблона
                      </label>
                      <textarea
                        value={selectedTemplate.content}
                        onChange={(e) => updateTemplate('content', e.target.value)}
                        className="w-full h-96 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="Введите содержимое шаблона..."
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Доступные переменные:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <p><code>{'{{ДОКУМЕНТ||Номер}}'}</code> - Номер документа</p>
                          <p><code>{'{{ДОКУМЕНТ||Дата}}'}</code> - Дата документа</p>
                          <p><code>{'{{СДЕЛКА||Фамилия}}'}</code> - Фамилия клиента</p>
                          <p><code>{'{{СДЕЛКА||Имя}}'}</code> - Имя клиента</p>
                          <p><code>{'{{СДЕЛКА||Отчество}}'}</code> - Отчество клиента</p>
                          <p><code>{'{{КОНТАКТ||Телефон}}'}</code> - Телефон клиента</p>
                        </div>
                        <div>
                          <p><code>{'{{СДЕЛКА||Марка}}'}</code> - Марка автомобиля</p>
                          <p><code>{'{{СДЕЛКА||Модель}}'}</code> - Модель автомобиля</p>
                          <p><code>{'{{СДЕЛКА||VIN}}'}</code> - VIN номер</p>
                          <p><code>{'{{СДЕЛКА||Год выпуска}}'}</code> - Год выпуска</p>
                          <p><code>{'{{ФАКТУРНАЯ ЧАСТЬ||Товары}}'}</code> - Таблица товаров</p>
                          <p><code>{'{{ФАКТУРНАЯ ЧАСТЬ||Итого}}'}</code> - Итоговая сумма</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Сохранить изменения
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplate(editingTemplates.find(t => t.id === selectedTemplate.id) || null);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отменить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Название:</h4>
                      <p className="text-gray-700">{selectedTemplate.name}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Описание:</h4>
                      <p className="text-gray-700">{selectedTemplate.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Содержимое:</h4>
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Edit2 size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Выберите шаблон для редактирования</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Сохранить все изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;