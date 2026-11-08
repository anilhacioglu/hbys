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
    public partial class frm_EkranMenu : Form
    {
        public frm_EkranMenu()
        {
            InitializeComponent();
            customizeDesing();
        }

        private void customizeDesing()
        {
            pnl_KayitSorgulama.Visible = false;
            pnl_YeniKayit.Visible = false;
            pnl_CalisanListesi.Visible = false;
            pnl_Hastalar.Visible = false;
            pnl_Odalar.Visible = false;
            pnl_OdaListesi.Visible = false;

        }

        private void hidesubmenu()
        {
            if (pnl_KayitSorgulama.Visible == true)
                pnl_KayitSorgulama.Visible = false;
            if (pnl_YeniKayit.Visible == true)
                pnl_YeniKayit.Visible = false;
            if (pnl_OdaListesi.Visible == true)
                pnl_OdaListesi.Visible = false;
        }

        private void showSubMenu(Panel subMenu)
        {
            if (subMenu.Visible == false)
            {
                hidesubmenu();
                subMenu.Visible = true;
            }  
            else
                subMenu.Visible = false;
        }
        public static DataGridViewRow SelectedRow { get; set; }

        private void btn_CikisYap_Click(object sender, EventArgs e)
        {
            System.Windows.Forms.Application.Exit();
        }

        private void btn_OturumKapat_Click(object sender, EventArgs e)
        {
            this.Hide();
            frm_GirisEkran mm = new frm_GirisEkran();
            mm.Show();
        }

        private void frm_EkranMenu_Load(object sender, EventArgs e)
        {
            this.doctorlistTableAdapter.Fill(this.veritabanıDoktor.doctorlist);
            this.patientlistTableAdapter.Fill(this.veritabanıHasta.patientlist);
            this.roomlistTableAdapter.Fill(this.veritabanıOda.roomlist);
        }

        private void btn_YeniHastaKayit_Click(object sender, EventArgs e)
        {
            frm_HastaKayıtEkranı mm = new frm_HastaKayıtEkranı();
            mm.Show();
        }

        private void btn_YeniCalisanKayit_Click(object sender, EventArgs e)
        {
            frm_ÇalışanKayıtEkranı mm = new frm_ÇalışanKayıtEkranı();
            mm.Show();
        }

        private void btn_OdaAtama_Click(object sender, EventArgs e)
        {
            frm_OdaAtamaEkranı mm = new frm_OdaAtamaEkranı();
            mm.Show();
        }
        private void btn_ReceteYaz_Click(object sender, EventArgs e)
        {
            frm_YeniReçeteEkranı mm = new frm_YeniReçeteEkranı();
            mm.Show();
        }

        private void btn_ReceteGoruntule_Click(object sender, EventArgs e)
        {
            frm_ReçeteGörüntüle mm = new frm_ReçeteGörüntüle();
            mm.Show();
        }

        private void btn_KayitSorgulama_Click(object sender, EventArgs e)
        {
            showSubMenu(pnl_KayitSorgulama);
        }

        private void btn_OdaListesi_Click(object sender, EventArgs e)
        {
            showSubMenu(pnl_OdaListesi);
        }

        private void btn_YeniKayit_Click(object sender, EventArgs e)
        {
            showSubMenu(pnl_YeniKayit);
        }

        private void btn_CalisanKayitSorgulama_Click(object sender, EventArgs e)
        {
            pnl_Hastalar.Visible = false;
            pnl_Odalar.Visible = false;
            pnl_CalisanListesi.Visible = true;
        }

        private void btn_HastaKayitSorgulama_Click(object sender, EventArgs e)
        {
            pnl_CalisanListesi.Visible = false;
            pnl_Odalar.Visible = false;
            pnl_Hastalar.Visible = true;
        }

        private void btn_OdaNumarasıSorgulama_Click(object sender, EventArgs e)
        {
            pnl_CalisanListesi.Visible = false;
            pnl_Hastalar.Visible = false;
            pnl_Odalar.Visible = true;
        }

        private void btn_HastaYenile_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            con.Open();
            string query = "Select * from patientlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_Hasta.DataSource = dtbl;
        }

        private void btn_CalisanYenile_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            con.Open();
            string query = "Select * from doctorlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_CalisanListe.DataSource = dtbl;
        }

        private void btn_HastaSil_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            SqlCommand xp = new SqlCommand("DELETE FROM patientlist WHERE Hasta_Kayıt_Numarası = @Hasta_Kayıt_Numarası", con);
            xp.Parameters.AddWithValue("@Hasta_Kayıt_Numarası", txt_HastaKayitNumarası.Text);
            con.Open();
            xp.ExecuteNonQuery();
            con.Close();

            string query = "Select * from patientlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_Hasta.DataSource = dtbl;
        }

        private void btn_CalisanSil_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            SqlCommand xp = new SqlCommand("DELETE FROM doctorlist WHERE Çalışan_Numarası = @Çalışan_Numarası", con);
            xp.Parameters.AddWithValue("@Çalışan_Numarası", txt_Doctorid.Text);
            con.Open();
            xp.ExecuteNonQuery();
            con.Close();

            string query = "Select * from doctorlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_CalisanListe.DataSource = dtbl;
        }

        private void btn_OdaYenile_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            con.Open();
            string query = "Select * from roomlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_Odalar.DataSource = dtbl;
        }

        private void btn_OdaSil_Click(object sender, EventArgs e)
        {
            SqlConnection con = new SqlConnection(@"Data Source=(LocalDB)\MSSQLLocalDB; AttachDbFilename=C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security=True");
            SqlCommand xp = new SqlCommand("DELETE FROM roomlist WHERE Oda_Numarası = @Oda_Numarası", con);
            xp.Parameters.AddWithValue("@Oda_Numarası", txt_OdaNumarası.Text);
            con.Open();
            xp.ExecuteNonQuery();
            con.Close();

            string query = "Select * from roomlist";
            SqlDataAdapter sda = new SqlDataAdapter(query, con);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            data_Odalar.DataSource = dtbl;
        }

        private void data_Hasta_CellContentDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SelectedRow = data_Hasta.Rows[e.RowIndex];

                frmHastaGuncellemeEkranı form2 = new frmHastaGuncellemeEkranı();
                form2.Show();
            }
        }

        private void data_CalisanListe_CellContentDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SelectedRow = data_CalisanListe.Rows[e.RowIndex];

                frm_CalisanGuncellemeEkranı form2 = new frm_CalisanGuncellemeEkranı();
                form2.Show();
            }
        }

        private void data_Odalar_CellContentDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                SelectedRow = data_Odalar.Rows[e.RowIndex];

                frm_OdaGüncellemeEkranı form2 = new frm_OdaGüncellemeEkranı();
                form2.Show();
            }
        }

        private void btn_Bilgi_Click(object sender, EventArgs e)
        {
            if (lbl_Bilgilendirme.Visible == true)
            {
                lbl_Bilgilendirme.Visible = false;
            }
            else
            {
                lbl_Bilgilendirme.Visible = true;
            }
        }
    }
}
