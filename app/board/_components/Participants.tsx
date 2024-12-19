"use client";

import { useOthers, useSelf } from "@/liveblocks.config";
import { UserAvatar } from "./UserAvatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute top-2 right-2 h-12 flex items-center shadow-md bg-white dark:bg-slate-700 dark:text-gray-200 rounded-md p-3">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
          return (
            <UserAvatar
              borderColor={connectionIdToColor(currentUser.connectionId!)}
              key={connectionId}
              src={info?.picture}
              name={info?.name}
              fallback={info?.name?.[0] || "A"}
            />
          );
        })}

        {currentUser && (
          <>
            <UserAvatar
              src={currentUser.info?.picture}
              name={`${currentUser.info?.name} (You)`}
              fallback={currentUser.info?.name?.[0]}
            />
          </>
        )}

        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute top-2 right-2 h-12 flex items-center shadow-md bg-white dark:bg-slate-700 rounded-md p-3 w-[100px] animate-pulse duration-1000" />
  );
};
