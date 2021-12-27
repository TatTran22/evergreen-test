import { Pane, FilePicker } from 'evergreen-ui'

export type UploadButtonProps = {
  onUpload: FileList
  loading: boolean
}

export default function UploadButton(props: UploadButtonProps) {
  return (
    <Pane>
      <FilePicker
        multiple={false}
        width={250}
        onChange={props.onUpload}
        disabled={props.loading}
        accept="image/*"
        placeholder="Chọn ảnh mới của bạn tại đây!"
      />
    </Pane>
  )
}
