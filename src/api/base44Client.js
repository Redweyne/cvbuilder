import { Base44Client } from '@base44/client';
import { CVDocument } from '../entities/CVDocument';
import { JobOffer } from '../entities/JobOffer';
import { Template } from '../entities/Template';
import { UserSubscription } from '../entities/UserSubscription';
import { CoverLetter } from '../entities/CoverLetter';

export const base44 = new Base44Client({
  entities: {
    CVDocument,
    JobOffer,
    Template,
    UserSubscription,
    CoverLetter,
  },
});
