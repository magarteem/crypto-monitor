import styles from './pageTitle.module.css'

interface PageTitleProps {
    title: string
    subtitle: string
}

export const PageTitle = ({ title, subtitle }: PageTitleProps) => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    )
}
