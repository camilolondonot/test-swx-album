import { Link } from 'react-router-dom'
import { cn } from '@/utils/index'

const Button = ({ children, onClick, className = '', type = 'button', size = 'medium', variant = 'primary', ...props }) => {

  const classDefault = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const buttonVariant = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  const buttonSize = {
    small: 'py-2 px-4  text-sm',
    medium: 'py-3 px-8 text-base',
    large: 'py-4 px-12 text-lg',
  }

  const buttonClasses = cn(
    buttonVariant[variant],
    buttonSize[size],
    classDefault,
    className,
  )

  if (type === 'submit') {
    return (
      <button className={buttonClasses} type="submit" {...props}>
        {children}
      </button>
    )
  }

  if (type === 'button') {
    return (
      <button className={buttonClasses} type="button" {...props}>
        {children}
      </button>
    )
  }

  if (type === 'link') {
    return (
      <Link className={buttonClasses} to={props.to} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button className={buttonClasses} type="button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button