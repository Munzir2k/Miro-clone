'use client';
import {useOrganization} from '@clerk/nextjs';
import EmptyOrg from '../_components/EmptyOrg';
import BoardList from '../_components/BoardList';

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}
function DashboardPage({searchParams}: DashboardPageProps) {
  const {organization} = useOrganization();
  return (
    <div className="flex-1 h-[calc(100vh-80px)]">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <p>
          <BoardList
            orgId={organization.id}
            query={searchParams}
          />
        </p>
      )}
    </div>
  );
}

export default DashboardPage;
