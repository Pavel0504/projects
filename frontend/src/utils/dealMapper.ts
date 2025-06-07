import { AmoCrmDeal, AmoCrmContact } from '../services/amoCrmApi';
import { DealData } from '../types';

export function mapAmoCrmDealToLocal(
  deal: AmoCrmDeal, 
  contact?: AmoCrmContact
): DealData {
  // Extract custom field values
  const getCustomFieldValue = (fieldId: number, fieldCode?: string): string => {
    if (deal.custom_fields_values) {
      const field = deal.custom_fields_values.find(f => f.field_id === fieldId);
      if (field && field.values.length > 0) {
        return field.values[0].value;
      }
    }
    return '';
  };

  const getContactFieldValue = (fieldCode: string): string => {
    if (contact?.custom_fields_values) {
      const field = contact.custom_fields_values.find(f => 
        f.field_code === fieldCode || f.field_id.toString() === fieldCode
      );
      if (field && field.values.length > 0) {
        return field.values[0].value;
      }
    }
    return '';
  };

  // Parse name from contact
  let firstName = '';
  let lastName = '';
  let middleName = '';

  if (contact) {
    if (contact.first_name) firstName = contact.first_name;
    if (contact.last_name) lastName = contact.last_name;
    
    // If no structured name, try to parse from full name
    if (!firstName && !lastName && contact.name) {
      const nameParts = contact.name.split(' ').filter(part => part.length > 0);
      if (nameParts.length >= 1) lastName = nameParts[0];
      if (nameParts.length >= 2) firstName = nameParts[1];
      if (nameParts.length >= 3) middleName = nameParts[2];
    }
  }

  // Get phone from contact
  const phone = getContactFieldValue('PHONE') || getContactFieldValue('66192') || '';

  // Map deal status
  const getStatusName = (statusId: number): string => {
    // This is a simplified mapping - in real implementation you'd fetch pipeline/status data
    const statusMap: Record<number, string> = {
      142: 'Первичный контакт',
      143: 'Переговоры',
      144: 'Принимают решение',
      145: 'Согласование договора',
      146: 'Успешно реализовано',
      147: 'Закрыто и не реализовано'
    };
    return statusMap[statusId] || 'Неизвестный статус';
  };

  return {
    id: deal.id.toString(),
    number: deal.id.toString(), // Using deal ID as number
    date: new Date(deal.created_at * 1000).toISOString().split('T')[0],
    clientName: {
      lastName: lastName || 'Не указано',
      firstName: firstName || 'Не указано',
      middleName: middleName || ''
    },
    phone: phone || 'Не указан',
    car: {
      brand: getCustomFieldValue(0, 'CAR_BRAND') || 'Не указано',
      model: getCustomFieldValue(0, 'CAR_MODEL') || 'Не указано',
      vin: getCustomFieldValue(0, 'CAR_VIN') || 'Не указан',
      year: getCustomFieldValue(0, 'CAR_YEAR') || 'Не указан'
    },
    status: getStatusName(deal.status_id),
    amount: deal.price || 0
  };
}