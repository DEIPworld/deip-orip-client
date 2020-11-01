import { modulesLayout } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/layout';
import { modulesGrid } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/grid';
import { modulesBasic } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/basic';
import { modulesUi } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/ui';
import { modulesTable } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/table';
import { modulesTypography } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/typography';
import { modulesComponents } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/components';
import { modulesAttributes } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules/attributes';

export const modulesFactory = (ctx) => [
  {
    name: 'Layout',
    icon: 'mdi-view-compact-outline',
    modules: modulesLayout
  },
  {
    name: 'Grid',
    icon: 'mdi-view-grid-outline',
    modules: modulesGrid
  },
  {
    name: 'Basic',
    icon: 'mdi-format-list-text',
    modules: modulesBasic
  },
  {
    name: 'UI components',
    icon: 'mdi-checkbox-multiple-blank-outline',
    modules: modulesUi
  },
  {
    name: 'Table',
    icon: 'mdi-table',
    modules: modulesTable
  },
  {
    name: 'Typography',
    icon: 'mdi-text-subject',
    modules: modulesTypography
  },
  {
    name: 'Attributes',
    icon: 'mdi-puzzle-outline',
    modules: modulesAttributes(ctx)
  },
  {
    name: 'Components',
    icon: 'mdi-card-bulleted-settings-outline',
    modules: modulesComponents
  }
];
