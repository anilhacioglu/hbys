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
    public partial class frm_ÇalışanKayıtEkranı : Form
    {
        public frm_ÇalışanKayıtEkranı()
        {
            InitializeComponent();
        }

        private void btn_Kaydet_Click(object sender, EventArgs e)
        {
            string kisaunvan;
            switch (cmb_Unvan.Text)
            {
                case "Stajyer Doktor":
                    kisaunvan = "Stj. Dr.";
                    break;

                case "İntern Doktor":
                    kisaunvan = "İnt. Dr.";
                    break;

                case "Pratisyen Doktor":
                    kisaunvan = "Pr. Dr.";
                    break;
                case "Uzman Doktor":
                    kisaunvan = "Uz. Dr.";
                    break;
                case "Operatör Doktor":
                    kisaunvan = "Op. Dr.";
                    break;
                case "Yardımcı Doçent":
                    kisaunvan = "Yr. Doç. Dr.";
                    break;
                case "Doçent":
                    kisaunvan = "Doç. Dr.";
                    break;
                case "Profesör":
                    kisaunvan = "Prof. Dr.";
                    break;
                case "Ordinaryüs":
                    kisaunvan = "Ord. Dr.";
                    break;
                default:
                    kisaunvan = " ";
                    break;
            }

            SqlConnection sql = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            {
                SqlCommand yeni = new SqlCommand("insert into doctorlist (TC_Kimlik_Numarası, Ad, Soyad, Ünvan, Bölüm, İletişim_Numarası, Mail_Adresi, Doğum_Yeri, Doğum_Tarihi, Cinsiyet, Kan_Grubu, Güvenlik_Kurumu, Öz_Geçmiş, Açıklama, Hastaneye_Giriş_Tarihi,fulldoctorid) values (@TC_Kimlik_Numarası, @Ad, @Soyad, @Ünvan, @Bölüm, @İletişim_Numarası, @Mail_Adresi, @Doğum_Yeri, @Doğum_Tarihi, @Cinsiyet, @Kan_Grubu, @Güvenlik_Kurumu, @Öz_Geçmiş, @Açıklama, @Hastaneye_Giriş_Tarihi, @fulldoctorid)", sql);
                yeni.Parameters.AddWithValue("@TC_Kimlik_Numarası", txt_TcKimlikNo.Text);
                yeni.Parameters.AddWithValue("@Ad", txt_Ad.Text);
                yeni.Parameters.AddWithValue("@Soyad", txt_Soyad.Text);
                yeni.Parameters.AddWithValue("@Ünvan", cmb_Unvan.Text);
                yeni.Parameters.AddWithValue("@Bölüm", cmb_Bolum.Text);
                yeni.Parameters.AddWithValue("@İletişim_Numarası", txt_İletisimNo.Text);
                yeni.Parameters.AddWithValue("@Mail_Adresi", txt_MailAdres.Text);
                yeni.Parameters.AddWithValue("@Doğum_Yeri", cmb_DogumYeri.Text);
                yeni.Parameters.AddWithValue("@Doğum_Tarihi", dt_DogumTarihi.Text);
                yeni.Parameters.AddWithValue("@Cinsiyet", cmb_Cinsiyet.Text);
                yeni.Parameters.AddWithValue("@Kan_Grubu", cmb_KanGrubu.Text);
                yeni.Parameters.AddWithValue("@Güvenlik_Kurumu", cmb_GüvenlikKurumu.Text);
                yeni.Parameters.AddWithValue("@Öz_Geçmiş", txt_Ozgecmis.Text);
                yeni.Parameters.AddWithValue("@Açıklama", txt_Acıklama.Text);
                yeni.Parameters.AddWithValue("@Hastaneye_Giriş_Tarihi", dt_HasteneyeGirisTarihi.Text);
                yeni.Parameters.AddWithValue("@fulldoctorid", kisaunvan + " " + txt_Ad.Text + " " + txt_Soyad.Text);



                sql.Open();
                yeni.ExecuteNonQuery();
                sql.Close();

                this.Close();
                MessageBox.Show("Ekleme Başarılı, Lütfen Çalışan Sorgulama sayfasını yenileyiniz");
            }
        }

        private void btn_İptal_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}

