import React from 'react';
import { DocumentTemplate } from '../types';
import { FileText, Check } from 'lucide-react';

interface TemplateSelectorProps {
  templates: DocumentTemplate[];
  selectedTemplate: DocumentTemplate | null;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Выберите шаблон документа</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${
                selectedTemplate?.id === template.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  {selectedTemplate?.id === template.id && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;