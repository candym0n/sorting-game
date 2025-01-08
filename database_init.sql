-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2025 at 12:28 PM
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
-- Database: `sorting_game`
--

-- --------------------------------------------------------

--
-- Table structure for table `algorithms`
--

CREATE TABLE `algorithms` (
  `id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `space_complexity` varchar(256) DEFAULT NULL,
  `time_complexity` varchar(256) DEFAULT NULL,
  `implementation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `algorithms`
--

INSERT INTO `algorithms` (`id`, `name`, `space_complexity`, `time_complexity`, `implementation`) VALUES
(1, 'Bubble sort', 'O(1)', 'O(n^2)', 'var n = length();\nvar swapped = false;\n\ndo {\n  swapped = false\n  for (var i = 0; i < n - 1; i++) {\n    var current = get(i);\n    var next = get(i + 1);\n\n    if (current > next) {\n      swap(i, i + 1)\n      swapped = true;\n    }\n  }\n  n--;\n} while (swapped);'),
(2, 'Insertion Sort', 'O(1)', 'O(n^2)', 'var len = length();\r\nfor (var i = 1; i < len; i++) {\r\n  var current = get(i);\r\n  var j = i - 1;\r\n  while (j >= 0 && get(j) > current) {\r\n    swap(j, j + 1);\r\n    j--;\r\n  }\r\n}'),
(3, 'Gnome Sort', 'O(1)', 'O(n^2)', 'var len = length();\r\nvar index = 0;\r\nwhile (index < len) {\r\n  if (index == 0 || get(index) >= get(index - 1)) {\r\n    index++;\r\n  } else {\r\n    swap(index, index - 1);\r\n    index--;\r\n  }\r\n}'),
(4, 'Selection Sort', 'O(1)', 'O(n^2)', 'var len = length();\r\nfor (var i = 0; i < len - 1; i++) {\r\n  var minIndex = i;\r\n  for (var j = i + 1; j < len; j++) {\r\n    if (get(j) < get(minIndex)) {\r\n      minIndex = j;\r\n    }\r\n  }\r\n  if (minIndex != i) {\r\n    swap(i, minIndex);\r\n  }\r\n}'),
(5, 'Heap Sort', 'O(1)', 'O(n \\log n)', 'var len = length();\r\n\r\nfunction heapify(n, i) {\r\n  var largest = i;\r\n  var left = 2 * i + 1;\r\n  var right = 2 * i + 2;\r\n\r\n  if (left < n && get(left) > get(largest)) {\r\n    largest = left;\r\n  }\r\n  if (right < n && get(right) > get(largest)) {\r\n    largest = right;\r\n  }\r\n  if (largest != i) {\r\n    swap(i, largest);\r\n    heapify(n, largest);\r\n  }\r\n}\r\n\r\nfor (var i = Math.floor(len / 2) - 1; i >= 0; i--) {\r\n  heapify(len, i);\r\n}\r\n\r\nfor (var i = len - 1; i > 0; i--) {\r\n  swap(0, i);\r\n  heapify(i, 0);\r\n}');

-- --------------------------------------------------------

--
-- Table structure for table `explanations`
--

CREATE TABLE `explanations` (
  `id` int(11) NOT NULL,
  `type` enum('algo_visual_sound','algo_sound','step_first','step_tenth','optimize_list','sort_algo','sort_scratch','article') DEFAULT NULL,
  `sort_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `explanations`
--

INSERT INTO `explanations` (`id`, `type`, `sort_id`, `description`) VALUES
(1, 'algo_sound', 1, 'The sound you’ll hear will be a falling scale of notes. Bubble sort is like checking pairs of neighboring items and swapping them if they’re out of order. In this case, the notes are like the items we\'re sorting, and we want to arrange them from smallest to biggest. Whenever we swap two notes, the one we’re bringing down is always higher than the last one we brought down. This keeps making a smooth downward slide of notes, creating a scale that goes down step by step.');

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `level_index` int(11) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`id`, `level_index`, `name`) VALUES
(1, 1, 'The Beginning...'),
(2, 2, 'Yesterday'),
(3, 3, 'Let it be'),
(4, 4, 'The Gambler'),
(5, 5, 'Twist And Shout'),
(6, 6, 'Yellow Submarine'),
(7, 7, 'Nowhere Man');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` int(11) NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `type` enum('algo_visual_sound','algo_sound','step_first','step_tenth','optimize_list','sort_algo','sort_scratch','article') DEFAULT NULL,
  `section_index` int(11) DEFAULT NULL,
  `required` int(11) DEFAULT NULL,
  `time_limit` int(11) DEFAULT NULL,
  `sort_ids` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `level_id`, `type`, `section_index`, `required`, `time_limit`, `sort_ids`) VALUES
(2, 1, 'algo_sound', 1, 1, 30, '1, 3');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `data` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `algorithms`
--
ALTER TABLE `algorithms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `explanations`
--
ALTER TABLE `explanations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sort_id` (`sort_id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `algorithms`
--
ALTER TABLE `algorithms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `explanations`
--
ALTER TABLE `explanations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `explanations`
--
ALTER TABLE `explanations`
  ADD CONSTRAINT `explanations_ibfk_1` FOREIGN KEY (`sort_id`) REFERENCES `algorithms` (`id`);

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
