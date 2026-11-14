export interface MyLinksType {
  id: string;
  shortUrl: string;
  short_code: string;
  original_url: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  title: string | null;
}
export interface MyLinksProps {
  links: MyLinksType[];
  loading: boolean;
  setLinks : React.Dispatch<React.SetStateAction<MyLinksType[]>>;

}
