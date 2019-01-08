import CannerScript from 'canner-script';

export default (
  <root>
    <object keyName="info" title="Info"
     packageName="../components/customize-object-item"
    />
    <array keyName="posts" title="Posts" >
      <string keyName="title" title="Title" packageName="../components/customize-string-input" />
      <string keyName="content" ui="textarea" title="Content" />
    </array>
  </root>
)