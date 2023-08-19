import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { importAll } from "./util";
import {EventSource} from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Starter Custom Script",
      description: "A starter custom script for build",
      author: "SomeDev",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "Hello World!",
        description: "Message",
        secondaryDescription: "Enter a message here",
      },
    };
  },
  run: (runRequest) => {
    const { logger } = runRequest.modules;
    logger.info(runRequest.parameters.message);
    const eventSource: EventSource = {
      id: "example",
      name: "Example",
      events: []
    };
    const imports: Record<string, (arg: any) => void> = {
      'command': command => runRequest.modules.commandManager.registerSystemCommand(command),
      'condition': condition => runRequest.modules.conditionManager.registerConditionType(condition),
      'effect': effect => runRequest.modules.effectManager.registerEffect(effect),
      'event': event => eventSource.events.push(event),
      'filter': filter => runRequest.modules.eventFilterManager.registerFilter(filter),
      'game': game => runRequest.modules.gameManager.registerGame(game),
      'integration': integration => runRequest.modules.integrationManager.registerIntegration(integration),
      'restriction': restriction => runRequest.modules.restrictionManager.registerRestriction(restriction),
      'variable': variable => runRequest.modules.replaceVariableManager.registerReplaceVariable(variable),
    };

    for (const [path, func] of Object.entries(imports)) {
      importAll(path, func);
    }
    runRequest.modules.eventManager.registerEventSource(eventSource);
  },
};

export default script;
