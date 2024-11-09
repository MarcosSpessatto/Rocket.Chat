import { monolithIntegrationContainer } from '@rocket.chat/fuel';

import { MonolithTeamCollaborationModuleConsumer } from './consumer/team-collaboration';

monolithIntegrationContainer.registerSingleton('MonolithTeamCollaborationModuleConsumer', MonolithTeamCollaborationModuleConsumer);
