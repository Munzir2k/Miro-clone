"use client";

import EmptyFavorites from "./EmptyFavorites";
import EmptySearch from "./EmptySearch";
import EmptyBoards from "./EmptyBoards";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BoardCard } from "./BoardCard/Index";
import NewBoardButton from "./NewBoardButton";

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    };
}
const BoardList = ({ orgId, query }: BoardListProps) => {
    const data = useQuery(api.boards.get, { orgId, ...query });

    if (data === undefined) {
        return (
            <div>
                <h2 className="text-3xl">
                    {query.favorites ? "Favorites Boards" : "Team Boards"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    <NewBoardButton orgId={orgId} disabled />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                </div>
            </div>
        );
    }
    // If there is no data but has query is for a search, show the empty search page
    if (!data?.length && query.search) {
        return (
            <div>
                <EmptySearch />
            </div>
        );
    }
    // If there is no data but Favorites
    if (!data?.length && query.favorites) {
        return (
            <div>
                <EmptyFavorites />
            </div>
        );
    }
    // If there is none
    if (!data?.length) {
        return <EmptyBoards />;
    }

    return (
        <div>
            <h2 className="text-3xl">
                {query.favorites ? "Favorites Boards" : "Team Boards"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <NewBoardButton orgId={orgId} />
                {data?.map((board) => (
                    <BoardCard
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorId={board.authorId}
                        authorName={board.authorName}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        isFavorite={board.isFavorite}
                    />
                ))}
            </div>
        </div>
    );
};

export default BoardList;
