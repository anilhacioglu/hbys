using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace Hastane_Bilgi_Yönetim_Sistemi
{
    public partial class frm_OdaAtamaEkranı : Form
    {
        public frm_OdaAtamaEkranı()
        {
            InitializeComponent();
        }

        private void frm_OdaAtamaEkranı_Load(object sender, EventArgs e)
        {
            this.patientlistTableAdapter.Fill(this.veritabanıHasta.patientlist);
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btn_Kaydet_Click(object sender, EventArgs e)
        {
            SqlConnection sql = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            {
                SqlCommand xp = new SqlCommand("insert into roomlist (Oda_Numarası, Hasta, Giriş_Tarihi, Çıkıcağı_Tarih) values (@Oda_Numarası, @Hasta, @Giriş_Tarihi, @Çıkıcağı_Tarih)", sql);
                xp.Parameters.AddWithValue("@Oda_Numarası", txt_OdaNumarası.Text);
                xp.Parameters.AddWithValue("@Hasta", cmb_HastaTcKimlikNo.Text);
                xp.Parameters.AddWithValue("@Giriş_Tarihi", dt_OdayaGirisTarihi.Text);
                xp.Parameters.AddWithValue("@Çıkıcağı_Tarih", dt_TahminiCikisTarihi.Text);

                sql.Open();
                xp.ExecuteNonQuery();
                sql.Close();

                this.Close();
                MessageBox.Show("Ekleme Başarılı, Lütfen Oda Sorgulama sayfasını yenileyiniz");
            }
        }
    }
}
