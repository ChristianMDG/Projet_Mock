interface RichTextProps {
  content: string;
}

const RichText = (props: RichTextProps) => {
  return <>{props.content}</>;
};

export default RichText;
