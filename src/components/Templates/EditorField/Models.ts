import { IAllProps } from "@tinymce/tinymce-react";

export interface EditorFieldProps extends IAllProps {
  label?: string;
  name: string;
}
