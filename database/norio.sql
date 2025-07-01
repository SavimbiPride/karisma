-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2025 at 09:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `norio`
--

-- --------------------------------------------------------

--
-- Table structure for table `empe4`
--

CREATE TABLE `empe4` (
  `id` int(50) NOT NULL,
  `video` varchar(250) NOT NULL,
  `id_sesi` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jawaban`
--

CREATE TABLE `jawaban` (
  `id` int(50) NOT NULL,
  `jawaban` varchar(250) NOT NULL,
  `id_soal` int(11) NOT NULL,
  `benar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jawaban`
--

INSERT INTO `jawaban` (`id`, `jawaban`, `id_soal`, `benar`) VALUES
(293, 'huh?', 76, 1),
(294, 'huh', 76, 0),
(295, 'huuh???', 76, 0),
(296, 'HUH', 76, 0),
(297, 'huh', 77, 1),
(298, 'uh', 77, 0),
(299, 'h', 77, 0),
(300, 'hhu', 77, 0);

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(50) NOT NULL,
  `judul` varchar(250) NOT NULL,
  `foto_pengajar` varchar(250) NOT NULL,
  `nama_pengajar` varchar(250) NOT NULL,
  `deskripsi` varchar(250) NOT NULL,
  `image` varchar(250) NOT NULL,
  `harga` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `judul`, `foto_pengajar`, `nama_pengajar`, `deskripsi`, `image`, `harga`) VALUES
(22, 'how to get oreo', 'http://localhost:5000/uploads/1751341911425-364277545.jpeg', 'Ravlor', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', '1751347952459-7893793.jpg', 10000.00);

-- --------------------------------------------------------

--
-- Table structure for table `komentar`
--

CREATE TABLE `komentar` (
  `id` int(50) NOT NULL,
  `id_kelas` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `isi` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `id_kelas` int(50) NOT NULL,
  `kode_transaksi` varchar(50) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `total_pembayaran` decimal(10,2) NOT NULL,
  `tanggal_diterima` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','berhasil','gagal') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` int(50) NOT NULL,
  `id_sesi` int(50) NOT NULL,
  `id_soal` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `id_sesi`, `id_soal`) VALUES
(71, 82, 76),
(72, 83, 77);

-- --------------------------------------------------------

--
-- Table structure for table `sesi`
--

CREATE TABLE `sesi` (
  `id` int(50) NOT NULL,
  `judul_sesi` varchar(250) NOT NULL,
  `topik` varchar(250) NOT NULL,
  `id_kelas` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sesi`
--

INSERT INTO `sesi` (`id`, `judul_sesi`, `topik`, `id_kelas`) VALUES
(82, 'begin', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 22),
(83, 'hore ', 'plis bisa', 22);

-- --------------------------------------------------------

--
-- Table structure for table `soal`
--

CREATE TABLE `soal` (
  `id` int(50) NOT NULL,
  `soal` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soal`
--

INSERT INTO `soal` (`id`, `soal`) VALUES
(76, 'wehwidbbd'),
(77, 'bbwqubqudbq');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id` int(50) NOT NULL,
  `judul` varchar(250) NOT NULL,
  `image` varchar(250) NOT NULL,
  `deskripsi` varchar(250) NOT NULL,
  `id_kelas` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`id`, `judul`, `image`, `deskripsi`, `id_kelas`) VALUES
(118, 'tool', '1751352599310-265687752.jpg', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 22);

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE `tugas` (
  `id` int(50) NOT NULL,
  `soal_tugas` varchar(250) NOT NULL,
  `id_sesi` int(250) NOT NULL,
  `id_tugas_user` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id`, `soal_tugas`, `id_sesi`, `id_tugas_user`) VALUES
(81, 'tugas nya easy', 82, NULL),
(82, 'aku sayang onechan', 83, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tugas_user`
--

CREATE TABLE `tugas_user` (
  `id` int(50) NOT NULL,
  `pengumpulan` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `username` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `foto` varchar(250) NOT NULL DEFAULT '''default-avatar.png''',
  `tanggal_lahir` date NOT NULL,
  `alamat` varchar(250) NOT NULL,
  `domisili` varchar(250) NOT NULL,
  `role` enum('admin','user','mentor') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `foto`, `tanggal_lahir`, `alamat`, `domisili`, `role`) VALUES
(3, 'ravlor', 'user@rawul.com', '12345', 'profile_1750841629195.png', '2008-08-28', 'bumi', 'use ask', 'admin'),
(4, 'Ravlor', 'gtw@example.com', '12345', 'profile_1750838501802.jpg', '2007-03-04', 'jalan jalan malang', 'jawa ', 'user'),
(9, 'Ravlor1', 'ravlor1@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(10, 'Ravlor2', 'ravlor2@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(11, 'Ravlor3', 'ravlor3@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(12, 'Ravlor4', 'ravlor4@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(13, 'Ravlor5', 'ravlor5@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(14, 'Ravlor6', 'ravlor6@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(15, 'Ravlor7', 'ravlor7@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(16, 'Ravlor8', 'ravlor8@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(17, 'Ravlor10', 'ravlor10@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(22, 'Ravlor11', 'ravlor11@gmail.com', '12345', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(23, 'pim ', 'pim@rawul.com', '12345', 'profile_1751025594082.jpg', '2001-03-05', 'kota', 'kalimantan', 'user'),
(24, 'tukikmewing', 'rizzz@rawul.com', '12345', 'profile_1751027194410.jpeg', '1899-11-29', 'alamat', 'jawa jawa jawa', 'user'),
(25, 'Ravlor', 'hadza@gmail.com', '12345', '1751351543931-608722193.jpeg', '1899-11-27', 'bumi', 'jawa', 'mentor'),
(26, 'agus', 'agus@gmail.com', '123', 'default-avatar.png', '0000-00-00', '', '', 'mentor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `empe4`
--
ALTER TABLE `empe4`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_sesi`);

--
-- Indexes for table `jawaban`
--
ALTER TABLE `jawaban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_soal` (`id_soal`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `komentar`
--
ALTER TABLE `komentar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_sesi`),
  ADD KEY `id_soalQuiz` (`id_soal`);

--
-- Indexes for table `sesi`
--
ALTER TABLE `sesi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `tugas`
--
ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_sesi`),
  ADD KEY `id_tugas_user` (`id_tugas_user`);

--
-- Indexes for table `tugas_user`
--
ALTER TABLE `tugas_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `empe4`
--
ALTER TABLE `empe4`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `jawaban`
--
ALTER TABLE `jawaban`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `komentar`
--
ALTER TABLE `komentar`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `sesi`
--
ALTER TABLE `sesi`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `soal`
--
ALTER TABLE `soal`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `tugas`
--
ALTER TABLE `tugas`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `tugas_user`
--
ALTER TABLE `tugas_user`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `empe4`
--
ALTER TABLE `empe4`
  ADD CONSTRAINT `empe4_ibfk_1` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jawaban`
--
ALTER TABLE `jawaban`
  ADD CONSTRAINT `jawaban_ibfk_1` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `komentar`
--
ALTER TABLE `komentar`
  ADD CONSTRAINT `komentar_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `komentar_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_2` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quiz_ibfk_3` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sesi`
--
ALTER TABLE `sesi`
  ADD CONSTRAINT `sesi_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tools`
--
ALTER TABLE `tools`
  ADD CONSTRAINT `tools_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tugas`
--
ALTER TABLE `tugas`
  ADD CONSTRAINT `tugas_ibfk_1` FOREIGN KEY (`id_tugas_user`) REFERENCES `tugas_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tugas_ibfk_2` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
