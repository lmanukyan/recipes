import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({ value }){
    return (
        <Editor
            apiKey='kmzmb646d24w4ao183s1uwk29tt5eyl1tw05vi4x8gg0bsg0'
            onInit={(evt, editor) => console.log(editor) }
            initialValue={value}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
}