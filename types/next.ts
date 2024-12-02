export type PageProps<T = {}> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}; 