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
    public partial class frm_OdaGüncellemeEkranı : Form
    {
        public frm_OdaGüncellemeEkranı()
        {
            InitializeComponent();
        }

        string odano = " ";

        private void frm_OdaGüncellemeEkranı_Load(object sender, EventArgs e)
        {
            this.patientlistTableAdapter.Fill(this.veritabanıHasta.patientlist);
            txt_OdaNo.Text = frm_EkranMenu.SelectedRow.Cells[0].Value.ToString();
            cmb_TcKimlikNo.Text = frm_EkranMenu.SelectedRow.Cells[1].Value.ToString();
            dt_OdayaGirisTarihi.Text = frm_EkranMenu.SelectedRow.Cells[2].Value.ToString();
            dt_OdadanCikisTarihi.Text = frm_EkranMenu.SelectedRow.Cells[3].Value.ToString();
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btn_Guncelle_Click(object sender, EventArgs e)
        {
            SqlConnection sql = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            {
                SqlCommand xp = new SqlCommand("insert into roomlist (Oda_Numarası, Hasta, Giriş_Tarihi, Çıkıcağı_Tarih) values (@Oda_Numarası, @Hasta, @Giriş_Tarihi, @Çıkıcağı_Tarih)", sql);
                xp.Parameters.AddWithValue("@Oda_Numarası", txt_OdaNo.Text);
                xp.Parameters.AddWithValue("@Hasta", cmb_TcKimlikNo.Text);
                xp.Parameters.AddWithValue("@Giriş_Tarihi", dt_OdayaGirisTarihi.Text);
                xp.Parameters.AddWithValue("@Çıkıcağı_Tarih", dt_OdadanCikisTarihi.Text);

                odano = frm_EkranMenu.SelectedRow.Cells[0].Value.ToString();
                SqlCommand dl = new SqlCommand("DELETE FROM roomlist WHERE Oda_Numarası = @Oda_Numarası", sql);
                dl.Parameters.AddWithValue("@Oda_Numarası", odano);
                sql.Open();
                dl.ExecuteNonQuery();
                sql.Close();

                sql.Open();
                xp.ExecuteNonQuery();
                sql.Close();

                this.Close();
                MessageBox.Show("Güncelleme Başarılı, Lütfen Oda Sorgulama sayfasını yenileyiniz");
            }
        }
    }
}
