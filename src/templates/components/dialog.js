import { html } from 'lit';
import { localize } from '../../utils/localize';

export const dialogTemplate = (id, type) => html`
  <ha-dialog 
    id="${id}"
    heading="${localize.t(`dialogs.${type}.title`)}"
  >
    <div>
      ${localize.t(`dialogs.${type}.message`)}
    </div>
    <mwc-button 
      slot="primaryAction" 
      dialogAction="confirm"
      style="${type === 'stop' ? 'color: rgb(229, 57, 53);' : ''}"
    >
      ${localize.t(`dialogs.${type}.confirm`)}
    </mwc-button>
    <mwc-button 
      slot="secondaryAction" 
      dialogAction="cancel"
    >
      ${localize.t('controls.cancel')}
    </mwc-button>
  </ha-dialog>
`;