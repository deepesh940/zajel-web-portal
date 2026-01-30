import { CheckCircle, Circle, Clock, MapPin, Package, Truck, Flag } from "lucide-react";

interface TripStatus {
  stage: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

interface MilestoneTimelineProps {
  timeline: TripStatus[];
  variant?: "vertical" | "horizontal";
  showLocation?: boolean;
  compact?: boolean;
}

export function MilestoneTimeline({
  timeline,
  variant = "vertical",
  showLocation = true,
  compact = false,
}: MilestoneTimelineProps) {
  const getStageIcon = (stage: string) => {
    const stageLower = stage.toLowerCase();
    
    if (stageLower.includes("start") || stageLower.includes("assigned")) {
      return Truck;
    } else if (stageLower.includes("pickup")) {
      return Package;
    } else if (stageLower.includes("transit")) {
      return MapPin;
    } else if (stageLower.includes("arrived") || stageLower.includes("approaching")) {
      return Flag;
    } else if (stageLower.includes("delivered")) {
      return CheckCircle;
    }
    return Circle;
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Pending";
    
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (variant === "horizontal") {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-start gap-0 min-w-max px-4 py-6">
          {timeline.map((milestone, index) => {
            const Icon = getStageIcon(milestone.stage);
            const isLast = index === timeline.length - 1;
            const isCurrent = !milestone.completed && index > 0 && timeline[index - 1].completed;
            
            return (
              <div key={index} className="flex items-start flex-1 min-w-[180px]">
                {/* Milestone Item */}
                <div className="flex flex-col items-center flex-1">
                  {/* Icon */}
                  <div
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${
                        milestone.completed
                          ? "bg-[#174B7C] border-[#174B7C] text-white"
                          : isCurrent
                          ? "bg-white border-[#174B7C] text-[#174B7C] animate-pulse"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {isCurrent && (
                      <div className="absolute -inset-1 rounded-full border-2 border-[#174B7C] opacity-30 animate-ping" />
                    )}
                  </div>
                  
                  {/* Stage Name */}
                  <div className="mt-3 text-center">
                    <div
                      className={`
                        text-sm font-medium
                        ${milestone.completed ? "text-gray-900" : isCurrent ? "text-[#174B7C]" : "text-gray-500"}
                      `}
                    >
                      {milestone.stage}
                    </div>
                    
                    {/* Timestamp */}
                    {!compact && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(milestone.timestamp)}</span>
                      </div>
                    )}
                    
                    {/* Location */}
                    {!compact && showLocation && milestone.location && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="max-w-[160px] truncate">{milestone.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex items-center pt-5 px-2">
                    <div
                      className={`
                        h-0.5 w-8 transition-all
                        ${milestone.completed && timeline[index + 1].completed ? "bg-[#174B7C]" : "bg-gray-300"}
                      `}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical Timeline (Default)
  return (
    <div className="w-full">
      <div className="space-y-0">
        {timeline.map((milestone, index) => {
          const Icon = getStageIcon(milestone.stage);
          const isLast = index === timeline.length - 1;
          const isCurrent = !milestone.completed && index > 0 && timeline[index - 1].completed;
          
          return (
            <div key={index} className="flex gap-4">
              {/* Left: Icon & Line */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all z-10
                    ${
                      milestone.completed
                        ? "bg-[#174B7C] border-[#174B7C] text-white"
                        : isCurrent
                        ? "bg-white border-[#174B7C] text-[#174B7C] shadow-lg"
                        : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {isCurrent && (
                    <div className="absolute -inset-1 rounded-full border-2 border-[#174B7C] opacity-30 animate-ping" />
                  )}
                </div>
                
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`
                      w-0.5 h-16 transition-all
                      ${milestone.completed && timeline[index + 1].completed ? "bg-[#174B7C]" : "bg-gray-300"}
                      ${compact ? "h-12" : "h-16"}
                    `}
                  />
                )}
              </div>
              
              {/* Right: Content */}
              <div className={`flex-1 ${!isLast ? (compact ? "pb-8" : "pb-12") : "pb-4"}`}>
                <div
                  className={`
                    text-base font-medium
                    ${milestone.completed ? "text-gray-900" : isCurrent ? "text-[#174B7C]" : "text-gray-500"}
                  `}
                >
                  {milestone.stage}
                  {isCurrent && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-[#174B7C]">
                      In Progress
                    </span>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(milestone.timestamp)}</span>
                </div>
                
                {/* Location */}
                {showLocation && milestone.location && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{milestone.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
