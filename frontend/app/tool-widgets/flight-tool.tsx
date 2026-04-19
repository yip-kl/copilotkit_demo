"use client";

import React from "react";
import { useRenderTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

type FlightInfo = {
  flightNumber: string;
  date: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
  arrivalTime: string;
};

const FALLBACK_FLIGHT: FlightInfo = {
  flightNumber: "OS 87",
  date: "2025-12-15",
  origin: "Vienna",
  destination: "New York",
  departureTime: "2025-12-15T10:15:00Z",
  status: "On Time",
  arrivalTime: "2025-12-15T14:30:00Z",
};

export function useFlightRenderTool() {
  useRenderTool({
    name: "get_flight",
    parameters: z.object({
      flightNumber: z.string(),
      date: z.string(),
      origin: z.string(),
      destination: z.string(),
      departureTime: z.string(),
      status: z.string(),
      arrivalTime: z.string(),
    }),
    render: ({ args, result, status }: any) => {
      if (status !== "complete") {
        return (
          <div className="bg-slate-800 text-white p-4 rounded-lg max-w-md">
            <span className="animate-pulse">Retrieving flight info...</span>
          </div>
        );
      }

      const fromArgs = args || {};
      const fromResult = parseResult(result);
      const data: FlightInfo = {
        ...FALLBACK_FLIGHT,
        ...fromArgs,
        ...fromResult,
      };

      return <FlightCard data={data} />;
    },
  });
}

function parseResult(result: unknown): Partial<FlightInfo> {
  if (!result) return {};
  if (typeof result === "object") return result as Partial<FlightInfo>;
  if (typeof result !== "string") return {};

  try {
    return JSON.parse(result) as Partial<FlightInfo>;
  } catch {
    return {};
  }
}

function formatDay(date: string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(value);
}

function formatTime(date: string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

function FlightCard({ data }: { data: FlightInfo }) {
  return (
    <div className="rounded-xl mt-6 mb-4 max-w-md w-full bg-white border border-slate-200 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-sky-600"
              fill="currentColor"
              aria-hidden
            >
              <path d="M3 11.5 21 3l-8.5 18-2.5-7-7-2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900">{data.flightNumber}</h3>
          </div>
          <p className="text-xs text-slate-500">{formatDay(data.date)}</p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <p className="text-2xl font-semibold text-slate-900">{data.origin}</p>
          <p className="text-2xl font-semibold text-slate-500">-&gt;</p>
          <p className="text-2xl font-semibold text-slate-900">{data.destination}</p>
        </div>

        <div className="my-4 h-px bg-slate-200" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col items-start">
            <p className="text-xs text-slate-500">Departs</p>
            <p className="text-xl font-semibold text-slate-900">{formatTime(data.departureTime)}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs text-slate-500">Status</p>
            <p className="text-sm font-medium text-emerald-600">{data.status}</p>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs text-slate-500">Arrives</p>
            <p className="text-xl font-semibold text-slate-900">{formatTime(data.arrivalTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
