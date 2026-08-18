package com.kaushalsetu.modules.user.repository;

import com.kaushalsetu.common.enums.UserStatus;
import com.kaushalsetu.entity.Role;
import com.kaushalsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);
    
    	@Query("""
    	    SELECT u FROM User u
    	    WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
    	       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
    	       OR u.phone LIKE CONCAT('%', :search, '%')
    	""")
    	List<User> searchUsers(@Param("search") String search);

    	List<User> findByRole(Role role);

    	List<User> findByStatus(UserStatus status);

    	List<User> findByRoleAndStatus(Role role, UserStatus status);
    	
    	List<User> findByRole_RoleId(Integer roleId);

    	List<User> findByRole_RoleIdAndStatus(Integer roleId, UserStatus status);

}
