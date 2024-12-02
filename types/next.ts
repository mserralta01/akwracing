export type PageProps<T = unknown> = {
  params: Promise<T>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}; 