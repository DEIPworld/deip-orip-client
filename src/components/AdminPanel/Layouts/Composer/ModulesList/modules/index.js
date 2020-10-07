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
    modules: modulesLayout
  },
  {
    name: 'Grid',
    modules: modulesGrid
  },
  {
    name: 'Basic',
    modules: modulesBasic
  },
  {
    name: 'UI components',
    modules: modulesUi
  },
  {
    name: 'Table',
    modules: modulesTable
  },
  {
    name: 'Typography',
    modules: modulesTypography
  },
  {
    name: 'Attributes',
    modules: modulesAttributes(ctx)
  },
  {
    name: 'Components',
    modules: modulesComponents
  }
];
