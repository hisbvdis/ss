import Link from "next/link";
// -----------------------------------------------------------------------------
import styles from "./Logo.module.css";


export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link className={styles.logo__link} href="/catalog">SaySport</Link>
    </div>
  )
}