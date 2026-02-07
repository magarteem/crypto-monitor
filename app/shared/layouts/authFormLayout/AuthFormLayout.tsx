import styles from './authFormLayout.module.scss'

interface AuthFormLayoutProps {
    children: React.ReactNode
}

export const AuthFormLayout = ({ children }: AuthFormLayoutProps) => {
    return (
        <div className={styles.authFormLayout}>
            {children}
        </div>
    )
}
