import { EditorFieldProps } from "./models";
import { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";
import { useField } from "formik";
import { Form } from "react-bootstrap";

export const EditorField = (props: EditorFieldProps) => {
  const { label, name, ...otherProps } = props;
  const [field, meta] = useField(name);

  function handleEditorChange(value: string, _editor: TinyMCEEditor) {
    const type = "text";
    field.onChange({ target: { type, name, value } });
  }

  function handleBlur(e: unknown, editor: TinyMCEEditor) {
    field.onBlur({ target: { name } });
  }

  return (
    <>
      {label && <label>{label}</label>}
      <Editor
        {...otherProps}
        apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
        value={field.value}
        onEditorChange={handleEditorChange}
        onBlur={handleBlur}
        init={{
          height: 500,
          branding: false,
          menubar: false,
          plugins: [
            "advlist autolink lists link image imagetools charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link | image | media | help",
        }}
      />
      {meta.error ? (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          {meta.error}
        </Form.Control.Feedback>
      ) : null}
    </>
  );
};
