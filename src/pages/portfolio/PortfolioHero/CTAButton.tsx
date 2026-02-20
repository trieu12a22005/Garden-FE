import type React from 'react';
import Icon from '@ant-design/icons';
interface CTAButtonProps extends React.ComponentProps<'a'> {
  text: string;
  link: string;
  icon: React.ComponentType;
  bg?: string;
  bgHover?: string;
}

function CTAButton({
  text,
  link,
  icon,
  bg,
  bgHover,
  ...props
}: CTAButtonProps): React.JSX.Element {
  const bgClass = bg || 'bg-gray-100';
  const bgHoverClass = bgHover ? `${bgHover}` : 'hover:bg-gray-100/[0.5]';
  return (
    <a
      href={link}
      className={` p-2 transition-colors duration-300 text-center h-full flex flex-col items-center justify-center gap-4 text-white ${bgClass}  ${bgHoverClass}`}
      title={text}
      {...props}
    >
      <span className="text-[30px] lg:text-[42px]">
        <Icon component={icon} style={{}} />
      </span>
      <span className="text-[20px] lg:text-[22px] xl:text-[24px] text-ellipsis whitespace-nowrap font-semibold overflow-hidden w-full">
        {text}
      </span>
    </a>
  );
}
export default CTAButton;
//
