import { html } from 'lit';
import { localize } from '../../utils/localize';

export const materialSlotsTemplate = (slots) => html`
  <div class="materials">
    ${slots.map(slot => html`
      <div class="material-slot">
        <div 
          class="material-circle ${slot.active ? 'active' : ''}"
          style="background-color: ${slot.color || '#E0E0E0'}"
        ></div>
        <div class="material-type">
          ${slot.type || localize.t('materials.empty')}
        </div>
      </div>
    `)}
  </div>
`;