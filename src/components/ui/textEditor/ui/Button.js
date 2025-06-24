import './Button.css';
import classNames from "classnames";


export default function Button({
                                 'data-test-id': dataTestId,
                                 children,
                                 className,
                                 onClick,
                                 disabled,
                                 small,
                                 title,
                               }) {
  return (
      <button
          disabled={disabled}
          className={classNames(
              'Button__root',
              className,
              {
                  'Button__disabled' : disabled  ,
                  'Button__small' : small ,
              }

          )}
          onClick={onClick}
          title={title}
          aria-label={title}
          {...(dataTestId && { 'data-test-id': dataTestId })}
      >
        {children}
      </button>
  );
}
