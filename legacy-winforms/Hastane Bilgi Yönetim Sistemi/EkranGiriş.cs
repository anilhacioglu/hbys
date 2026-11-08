using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;


namespace Hastane_Bilgi_Yönetim_Sistemi
{
    public partial class frm_GirisEkran : Form
    {
        public frm_GirisEkran()
        {
            InitializeComponent();
        }
        private void btn_Giris_Click(object sender, EventArgs e)
        {
            SqlConnection sqlcon = new SqlConnection(@"Data Source = (LocalDB)\MSSQLLocalDB; AttachDbFilename = C:\Users\anilh\OneDrive\Masaüstü\Hastane Bilgi Yönetim Sistemi\VeritabanıHastane.mdf; Integrated Security = True; Connect Timeout = 30");
            string query = "Select * from login Where username = '" + txt_KullaniciAdi.Text.Trim() + "' and password = '" + txt_Sifre.Text.Trim() + "'";
            SqlDataAdapter sda = new SqlDataAdapter(query, sqlcon);
            DataTable dtbl = new DataTable();
            sda.Fill(dtbl);
            if (dtbl.Rows.Count.ToString() == "1")
            {
                this.Hide();
                frm_EkranMenu mm = new frm_EkranMenu();
                mm.Show();
            }
            else
            {
                lbl_Hata.ForeColor = System.Drawing.Color.LightSkyBlue;
            }
        }

        private void btn_Cikis_Click(object sender, EventArgs e)
        {
            System.Windows.Forms.Application.Exit();
        }
    }
}
