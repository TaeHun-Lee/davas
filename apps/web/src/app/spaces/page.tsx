import { SpacesScreen, type SpacesView } from '../../components/spaces/SpacesScreen';

type SpacesPageProps = {
  searchParams?: Promise<{ view?: string | string[] }>;
};

export default async function SpacesPage({ searchParams }: SpacesPageProps) {
  const params = await searchParams;
  const view = Array.isArray(params?.view) ? params.view[0] : params?.view;
  const initialView: SpacesView = view === 'recommend' ? 'recommend' : 'timeline';
  return <SpacesScreen initialView={initialView} />;
}
