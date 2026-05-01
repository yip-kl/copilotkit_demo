"use client";
import React from "react";
import "@copilotkit/react-core/v2/styles.css";
import "./style.css";
import { 
  useConfigureSuggestions,
  CopilotChat,
} from "@copilotkit/react-core/v2";
import { CopilotKit } from "@copilotkit/react-core";
import { useWeatherRenderTool } from "./tool-widgets/weather-tool";
import { useFlightRenderTool } from "./tool-widgets/flight-tool";

interface AgenticChatProps {
  params: Promise<{
    integrationId: string;
  }>;
}

const agent = "sample_agent";

const AgenticChat: React.FC<AgenticChatProps> = ({ params }) => {
  const { integrationId } = React.use(params);

  return (
    <CopilotKit
      runtimeUrl={`/api/copilotkit`}
      enableInspector={true}
      agent={agent}
    >
      <Chat />
    </CopilotKit>
  );
};

const Chat = () => {
  useWeatherRenderTool();
  useFlightRenderTool();

  useConfigureSuggestions({
    suggestions: [
      {
        title: "Is it a good idea to visit New York on Apr 15?",
        message: "Is it a good idea to visit New York on Apr 15?",
      }
    ],
    available: "always",
  });

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-full w-full md:w-8/10 md:h-8/10 rounded-lg">
        <CopilotChat
          agentId={agent}
          className="h-full rounded-2xl max-w-6xl mx-auto"
        />
      </div>
    </div>
  );
};

export default AgenticChat;