using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Windows.Forms;

namespace CARStoons
{
    public partial class Form1 : Form
    {
        // 1. CONEXIÓN AL SERVIDOR 
        string cadenaConexion = @"Server=LAPTOP-8K7LOV2H\SQLEXPRESS;Database=CARSTOON;Integrated Security=True;TrustServerCertificate=True;";

        SqlDataAdapter adaptador;
        DataTable tablaVirtual;
        string entidadActual = "Usuarios";

        
        private LinkLabel lblRutaEliminacion;

        public Form1()
        {
            InitializeComponent();
            dgvPrincipal.AllowUserToAddRows = false;
            dgvPrincipal.CurrentCellDirtyStateChanged += dgvPrincipal_CurrentCellDirtyStateChanged;

            
            lblRutaEliminacion = new LinkLabel();
            lblRutaEliminacion.Location = new Point(1470, 100);
            lblRutaEliminacion.Size = new Size(240, 500);
            lblRutaEliminacion.Font = new Font("Segoe UI", 10, FontStyle.Regular);
            lblRutaEliminacion.LinkBehavior = LinkBehavior.HoverUnderline;
            lblRutaEliminacion.LinkClicked += LblRutaEliminacion_LinkClicked; 
            this.Controls.Add(lblRutaEliminacion);
            
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            CargarTabla("Usuarios");
        }

    
        // MOTOR DE CARGA DE DATOS 
     
        private void CargarTabla(string nombreTabla)
        {
            try
            {
                entidadActual = nombreTabla;
                lblTitulo.Text = "Gestionando: " + nombreTabla;
                btnActualizar.Visible = false;

                
                ActualizarRutaEliminacion(nombreTabla);

                using (SqlConnection conexion = new SqlConnection(cadenaConexion))
                {
                    string query = $"SELECT * FROM {nombreTabla}";
                    adaptador = new SqlDataAdapter(query, conexion);

                    
                    adaptador.MissingSchemaAction = MissingSchemaAction.AddWithKey;

                    SqlCommandBuilder constructor = new SqlCommandBuilder(adaptador);

                    tablaVirtual = new DataTable();
                    adaptador.Fill(tablaVirtual);
                    dgvPrincipal.DataSource = tablaVirtual;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al cargar datos: " + ex.Message);
            }
        }


        // MÉTODOS EXACTOS QUE EL DESIGNER ESTÁ BUSCANDO


     
        private void Menu_Click(object sender, EventArgs e)
        {
            Button btn = (Button)sender;
            
            string textoBoton = btn.Text.Replace(" ", "").Replace(".", "");

           
            string nombreTablaSQL = textoBoton;

            
            if (textoBoton.Contains("Perz"))
                nombreTablaSQL = "OrdenesPersonalizacion";

            else if (textoBoton.Contains("Renta"))
                nombreTablaSQL = "OrdenesRenta";

            else if (textoBoton == "Reseñas")
                nombreTablaSQL = "Resenas";

            else if (textoBoton == "MetodosPago")
                nombreTablaSQL = "MetodosPago";

            else if (textoBoton == "Pagos")
                nombreTablaSQL = "Pagos";

            
            CargarTabla(nombreTablaSQL);
        }
     
        private void dgvPrincipal_CellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                btnActualizar.Visible = true;
                btnActualizar.BackColor = Color.LightGreen;
                btnActualizar.Text = "Guardar Cambios";
            }
        }

        private void dgvPrincipal_CurrentCellDirtyStateChanged(object sender, EventArgs e)
        {
            if (dgvPrincipal.IsCurrentCellDirty)
            {
                
                if (dgvPrincipal.CurrentCell is DataGridViewCheckBoxCell)
                {
                    dgvPrincipal.CommitEdit(DataGridViewDataErrorContexts.Commit);
                }
            }
        }

        
        private void btnActualizar_Click(object sender, EventArgs e)
        {
            try
            {
                
                using (SqlConnection conexion = new SqlConnection(cadenaConexion))
                {
                    
                    adaptador.SelectCommand.Connection = conexion;
                    SqlCommandBuilder constructor = new SqlCommandBuilder(adaptador);

                    adaptador.Update(tablaVirtual);
                    MessageBox.Show("Base de datos de Carstoons actualizada con éxito.");
                    btnActualizar.Visible = false;
                    CargarTabla(entidadActual); 
                }
            }
            catch (Exception ex)
            {
                tablaVirtual.RejectChanges();
                CargarTabla(entidadActual);
                MessageBox.Show("Error al guardar: " + ex.Message);
            }
        }

       
        private void btnEliminar_Click(object sender, EventArgs e)
        {
            if (dgvPrincipal.SelectedRows.Count > 0)
            {
                var result = MessageBox.Show("¿Eliminar de forma permanente?", "Carstoons", MessageBoxButtons.YesNo);
                if (result == DialogResult.Yes)
                {
                    try
                    {
                        dgvPrincipal.Rows.RemoveAt(dgvPrincipal.SelectedRows[0].Index);

                        using (SqlConnection conexion = new SqlConnection(cadenaConexion))
                        {
                            adaptador.SelectCommand.Connection = conexion;
                            SqlCommandBuilder constructor = new SqlCommandBuilder(adaptador);
                            adaptador.Update(tablaVirtual);
                        }
                        MessageBox.Show("Registro eliminado.");
                    }
                    catch (Exception ex)
                    {
                        tablaVirtual.RejectChanges();
                        CargarTabla(entidadActual);
                        MessageBox.Show("Error al eliminar: " + ex.Message);
                    }
                }
            }
        }

        private void btnInsertar_Click(object sender, EventArgs e)
        {
            
            if (tablaVirtual == null) return;

            
            FormInsertar ventanaInsertar = new FormInsertar(entidadActual, tablaVirtual);

            
            if (ventanaInsertar.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    using (SqlConnection conexion = new SqlConnection(cadenaConexion))
                    {
                        adaptador.SelectCommand.Connection = conexion;
                        SqlCommandBuilder constructor = new SqlCommandBuilder(adaptador);
                        adaptador.Update(tablaVirtual);
                        MessageBox.Show("¡Registro insertado con éxito!", "Carstoons");
                    }
                }
                catch (Exception ex)
                {
                    tablaVirtual.RejectChanges();
                    CargarTabla(entidadActual);
                    MessageBox.Show("Error al insertar: " + ex.Message);
                }
            }

        }

        private void lblTitulo_Click(object sender, EventArgs e)
        {

        }

       
        private void LblRutaEliminacion_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string tablaDestino = e.Link.LinkData.ToString();
            CargarTabla(tablaDestino);
        }

       
        private void CrearEnlace(string textoCompleto, string palabraClave, string nombreTablaSQL)
        {
            int inicio = textoCompleto.IndexOf(palabraClave);

           
            if (inicio != -1)
            {
                try
                {
                    lblRutaEliminacion.Links.Add(inicio, palabraClave.Length, nombreTablaSQL);
                }
                catch (Exception)
                {
                    
                }
            }
        }

        
        private void ActualizarRutaEliminacion(string entidad)
        {
            lblRutaEliminacion.Links.Clear(); 
            string texto = "";

            switch (entidad)
            {

                case "Usuarios":
                    texto = "RUTA DE ELIMINACIÓN:\n\n1. Borrar Citas\n2. Borrar Pagos\n3. Borrar Resenas\n4. Borrar ServiciosOrden\n5. Borrar OrdenesRenta\n6. Borrar OrdenesPerz\n7. Borrar Ordenes\n8. Eliminar Usuario";
                    lblRutaEliminacion.Text = texto;
                    CrearEnlace(texto, "Citas", "Citas");
                    CrearEnlace(texto, "Pagos", "Pagos");
                    CrearEnlace(texto, "Resenas", "Resenas");
                    CrearEnlace(texto, "ServiciosOrden", "ServiciosOrden");
                    CrearEnlace(texto, "OrdenesRenta", "OrdenesRenta");
                    CrearEnlace(texto, "OrdenesPerz", "OrdenesPersonalizacion");
                    CrearEnlace(texto, "Ordenes", "Ordenes");
                    break;

                case "Vehiculos":
                    texto = "RUTA PARA ELIMINAR VEHÍCULO:\n\n1. Ve a ServiciosOrden.\n2. Ve a OrdenesPersonalizacion.\n3. Ve a OrdenesRenta.\n4. ¡Listo! Ya podes eliminar el Vehículo.";
                    lblRutaEliminacion.Text = texto;
                    CrearEnlace(texto, "ServiciosOrden", "ServiciosOrden");
                    CrearEnlace(texto, "OrdenesPersonalizacion", "OrdenesPersonalizacion");
                    CrearEnlace(texto, "OrdenesRenta", "OrdenesRenta");
                    break;

                case "Mecanicos":
                    texto = "RUTA PARA ELIMINAR MECÁNICO:\n\n1. Ve a Citas.\n2. Ve a ServiciosOrden.\n3. Ve a OrdenesPersonalizacion.\n4. ya podes eliminar al Mecánico.";
                    lblRutaEliminacion.Text = texto;
                    CrearEnlace(texto, "Citas", "Citas");
                    CrearEnlace(texto, "ServiciosOrden", "ServiciosOrden");
                    CrearEnlace(texto, "OrdenesPersonalizacion", "OrdenesPersonalizacion");
                    break;

                case "Ordenes":
                    texto = "RUTA PARA ELIMINAR ORDEN MAESTRA:\n\n1. Ve a ServiciosOrden.\n2. Ve a OrdenesPersonalizacion.\n3. Ve a OrdenesRenta.\n4. Ve a Pagos y Resenas.\n5. ya podes eliminar la Orden.";
                    lblRutaEliminacion.Text = texto;
                    CrearEnlace(texto, "ServiciosOrden", "ServiciosOrden");
                    CrearEnlace(texto, "OrdenesPersonalizacion", "OrdenesPersonalizacion");
                    CrearEnlace(texto, "OrdenesRenta", "OrdenesRenta");
                    CrearEnlace(texto, "Pagos", "Pagos");
                    CrearEnlace(texto, "Resenas", "Resenas");
                    break;

                default:
                    lblRutaEliminacion.Text = "Puedes eliminar registros de esta tabla directamente sin causar conflictos de dependencias.";
                    break;
            }
        }
    }
}